const express=require("express");
const router=express.Router();
const wrapAsync=require("../utlis/WrapAsync.js");
const ExpressError=require("../utlis/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })
const Booking = require("../models/booking");



const listingController=require("../controllers/listing.js")
router.get("/search", wrapAsync(listingController.searchListingsPage));


router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing
    ,wrapAsync( listingController.createListing))

  //filter route  
 router.get("/filter",listingController.filter );
    
    


    
 //new route
 router.get("/new",isLoggedIn,(listingController.renderNewForm));
   
 router.route("/:id")
 .get(wrapAsync(listingController.showListing ))
 .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync( listingController.updateListing))
 .delete(isLoggedIn,wrapAsync(listingController.deleteListing));
 
 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))




 
 module.exports=router;