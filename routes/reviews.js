const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas')
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { validatereview, isLoggedIn, isReviewAuthor } = require('../middleware');


router.post('/', validatereview, isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Successfuly created review !");
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    console.log(id, reviewId);
    req.flash('success', "Successfuly deleted review !");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;