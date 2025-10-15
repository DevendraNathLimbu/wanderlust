const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapasync'); 
const {listingSchema} = require('../schema.js');
const { reviewSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { validateReview, IsLoggedIn, IsOwner, IsAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', IsLoggedIn , validateReview , wrapAsync(reviews.create));

//Delete Reviews

router.delete('/:reviewId', IsLoggedIn, IsAuthor, wrapAsync(reviews.delete));

module.exports = router;

