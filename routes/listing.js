const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync'); 
const {listingSchema} = require('../schema.js');
const { reviewSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');
const listingcontroller = require('../controllers/listings');
const { IsLoggedIn } = require('../middleware');
const { IsOwner, validateListing } = require('../middleware');

const multer  = require('multer');

const {storage} = require('../cloudconfig');

const upload = multer({ storage });

  //Index route + Create route

router.route('/').get(wrapAsync(listingcontroller.index))
.post(IsLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingcontroller.create));

  

// Sample route to create a new listing
    router.get('/new', upload.single('listing[image]'), IsLoggedIn, wrapAsync(listingcontroller.newPath));


//show, update and delete route
    router.route('/:id').get(wrapAsync(listingcontroller.show))
    .put(IsLoggedIn, upload.single('listing[image]'), IsOwner, wrapAsync(listingcontroller.update))
    .delete(IsLoggedIn, IsOwner, wrapAsync(listingcontroller.delete));


//update route
router.get('/:id/edit', IsLoggedIn, IsOwner, wrapAsync(listingcontroller.editPath));

module.exports = router;