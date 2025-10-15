const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema');
const Review = require('./models/review');

module.exports.IsLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //redirect url
          req.session.redirectURL = req.originalUrl;
            req.flash('error', 'You must be signed in first!');
            return res.redirect('/login');
        }
        next();
}

module.exports.saveRedirectURL = (req, res, next) => {
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.IsOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
         if(!listing.owner.equals(res.locals.currentUser._id)){
             req.flash('error', 'You do not have permission to do that!');
             return res.redirect('/listings/'+id);
         }
         next();
}

module.exports.validateListing = (req, res, next) => {
     let result = listingSchema.validate(req.body);
         console.log(result);
         let errors = result.error;
        if(errors){
            let msg = errors.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        }
        else{
        next();
        }

    };

    module.exports.validateReview = (req, res, next) => {
         let result = reviewSchema.validate(req.body);
             console.log(result);
             let errors = result.error;
            if(errors){
                let msg = errors.details.map(el => el.message).join(',');
                throw new ExpressError(msg, 400);
            }
            else{
            next();
            }
    
        };

module.exports.IsAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission to delete!');
        return res.redirect(`/listings/${id}`);
    }
   next();
}