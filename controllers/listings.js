const Listing = require('../models/listing');
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

module.exports.index = async (req, res) => {
    console.log(process.env.CLOUD_NAME);
   const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
}

module.exports.newPath = async (req, res) => {
      res.render('listings/new');
    }

module.exports.create = async (req, res) => {
            
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
                        if (req.file) {
                                let url = req.file.path;
                                let filename = req.file.filename;
                                newListing.image = {url, filename};
                        }
            console.log(newListing);

            // Set location data
            const location = req.body.listing.location;
    let getData;
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
        getData = await response.json();

        if (!Array.isArray(getData) || getData.length === 0) {
            return res.send("Location not found!");
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        return res.send("Error fetching location data");
    }
    console.log(getData[0]);
    let { lat, lon } = getData[0];
    // ensure numeric values and correct order [lon, lat]
    const latitude = Number(lat);
    const longitude = Number(lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.send("Invalid location coordinates returned from geocoding service");
    }
    newListing.location = { type: 'Point', coordinates: [longitude, latitude], place: location };


        await newListing.save();
        req.flash('success', 'Successfully made a new listing!');

        res.redirect(`/listings`);
    };


    module.exports.show = async (req, res) => {
    const { id } = req.params;
    const listing  = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
       console.log(listing);
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}

module.exports.editPath = async (req, res) => {
    const { id } = req.params;
    const listing  = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }

    let originalImg = listing.image.url;
    originalImg = originalImg.replace('/upload', '/upload/w_250');
    res.render('listings/edit', { listing, originalImg });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash('success', 'Successfully updated listing');
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted listing');
    res.redirect('/listings');
}