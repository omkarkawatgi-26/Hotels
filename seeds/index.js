const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const axios = require('axios');

mongoose.connect('mongodb://0.0.0.0:27017', {
    // useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
})

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];


const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 5000);
        var timestamp = new Date().getTime();
        const camp = new Campground({
            author: "64c9406e5092520fe28aa40a",
            location: `${cities[rand].city} ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum ut dolores amet et praesentium reiciendis consequatur veritatis quasi dignissimos dolor eos blanditiis voluptatibus rem nesciunt iusto, nulla nihil, ad explicabo!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dantd7hni/image/upload/v1692192085/YelpCamp/sfbmvenz4ytbiayhv557.jpg',
                    filename: 'YelpCamp/sfbmvenz4ytbiayhv557',

                },
                {
                    url: 'https://res.cloudinary.com/dantd7hni/image/upload/v1692192090/YelpCamp/ehji7phy6kyrkzqmdrh5.jpg',
                    filename: 'YelpCamp/ehji7phy6kyrkzqmdrh5',

                },
                {
                    url: 'https://res.cloudinary.com/dantd7hni/image/upload/v1692192095/YelpCamp/uqr8dxf3qqettwrodppc.jpg',
                    filename: 'YelpCamp/uqr8dxf3qqettwrodppc',

                },
                {
                    url: 'https://res.cloudinary.com/dantd7hni/image/upload/v1692192098/YelpCamp/k0jngfn9zpxnmbtsmigp.jpg',
                    filename: 'YelpCamp/k0jngfn9zpxnmbtsmigp',

                },
                {
                    url: 'https://res.cloudinary.com/dantd7hni/image/upload/v1692192100/YelpCamp/bhopdf5eywnspcq9ztbf.jpg',
                    filename: 'YelpCamp/bhopdf5eywnspcq9ztbf',

                }
            ]
        })
        await camp.save();
    }
}



seedDB().then(() => {
    mongoose.connection.close();
});