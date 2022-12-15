const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const route = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');

route.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

route.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = route;