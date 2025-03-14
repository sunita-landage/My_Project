const ExpressError=require("./utlis/ExpressError.js");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const { listingSchema ,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
      
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
         return res.redirect("/login");
      }
        next();
      
}

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
  res.locals.redirectUrl=req.session.redirectUrl;
}
next();
};

module.exports.isOwner=async(req,res,next)=>{
  let{id}=req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
   req.flash("error","you are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//listing validataion
module.exports. validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
  
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
    next();
    }
 }


 module.exports.isReviewAuthor=async(req,res,next)=>{
  let{reviewId,id}=req.params;
  let review= await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
   req.flash("error","you are not author of this review ");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
