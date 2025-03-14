const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utlis/WrapAsync.js");
const ExpressError=require("../utlis/ExpressError.js");
const Review=require("../models/review");
const Listing=require("../models/listing.js");
// const {validateReview}=require("../middleware.js");
const{reviewSchema}=require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const review = require("../models/review.js");
const reviewController=require("../controllers/reviews.js")

 const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);

  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
  next();
  }
}


//reviews
router.post("/",isLoggedIn,validateReview, wrapAsync( reviewController.createReview));
   
   // delete review route
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

 
   module.exports=router;