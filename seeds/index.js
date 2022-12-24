if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//connect to mongoose:
mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => {
        console.log("connected to mongoDB.");
    })
    .catch(err => {
        console.log('Error in mongoDB connection');
        console.log(err);
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        let random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000 + 500);
        const location = `${cities[random1000].city} ${cities[random1000].state}`;
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        const geometry = geoData.body.features[0].geometry;

        const newCamp = new Campground({
            author: '63956a4ca02aab05cedec66d',
            location ,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore animi quos doloremque ex quae a sint nemo cum vero ea!',
            price,
            geometry,
            images: [
                {
                  url: 'https://res.cloudinary.com/dwlod718f/image/upload/v1671688366/YelpCamp/s2agrxulji1kjicomgym.jpg',
                  filename: 'YelpCamp/s2agrxulji1kjicomgym'
                },
                {
                  url: 'https://res.cloudinary.com/dwlod718f/image/upload/v1671688368/YelpCamp/dvb9e7tpuh3yydxtszbs.jpg',
                  filename: 'YelpCamp/dvb9e7tpuh3yydxtszbs'
                }
              ]
        });
        await newCamp.save();
    }
}

seedDB().then(() => {
    console.log("seeding completed.");
    console.log("Application is ready to Serve. Run app.js");
    mongoose.connection.close();
});