if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const campgroundsRoute = require('./routes/campgrounds')
const reviewsRoute = require('./routes/reviews');
const userRoute = require('./routes/user');
const dbUrl = process.env.DB_URL || process




mongoose.connect(dbUrl, {
    //  useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));




const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log("Session store error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// Testing passport and passport-local Easy to use but little complex to understand !
// app.get('/fakeuser', async (req, res) => {
//     const user = new User({ email: "ok@ok", username: "omkar kawatgi" });
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);

// })

app.get('/', (req, res) => {
    res.render('Home')
})

app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/review', reviewsRoute);
app.use('/', userRoute);



// When there is an express error when nothing is matches with our routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// When there is error due to some function 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) { message = "Something went wrong !" }
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("server is running on port 3000")
})