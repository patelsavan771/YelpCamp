const express = require('express');
const route = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');



route.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

route.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'New campground created successfully!!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

route.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

route.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
                                        .populate({
                                            path: 'reviews',
                                            populate: {
                                                path: 'author'
                                            }
                                        }).populate('author');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

route.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

route.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Campground updated successfully!!');
    res.redirect(`/campgrounds/${req.params.id}`);
}));

route.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!!');
    res.redirect('/campgrounds');
}));

module.exports = route;