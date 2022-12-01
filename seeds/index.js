const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

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
        const price = Math.floor(Math.random() * 10000 + 5000);
        const newCamp = new Campground({
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore animi quos doloremque ex quae a sint nemo cum vero ea!',
            price
        });
        await newCamp.save();
    }
}

seedDB().then(() => {
    console.log("seeding completed.");
    mongoose.connection.close();
});