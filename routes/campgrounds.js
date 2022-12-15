const express = require('express');
const route = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

route.get('/', catchAsync(campgrounds.index));

route.get('/new', isLoggedIn, campgrounds.renderNewForm);

route.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

route.get('/:id', catchAsync(campgrounds.showCampground));

route.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

route.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

route.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = route;