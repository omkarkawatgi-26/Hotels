const User = require('../models/user');

module.exports.renderRegister = (req, res) => { res.render('user/register') }

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to yelpcamp !')
            res.redirect('/campgrounds');
        });

    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = async (req, res) => {
    res.render('user/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to Yelpcamp !')

    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'GoodBye 🙂!')
        res.redirect('/campgrounds')
    })
}

