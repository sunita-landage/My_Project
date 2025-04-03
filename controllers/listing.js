const Listing=require("../models/listing")

//filter
module.exports.filter=async (req, res) => {
        let category = req.query.category;
    
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }
    
        try {
            let listings = await Listing.find({ category: { $regex: new RegExp("^" + category + "$", "i") } });
            // console.log("Filtered Listings:", listings); // Debugging ke liye
            res.json(listings);
        } catch (error) {
            console.error("Error filtering listings:", error);
            res.status(500).json({ error: "Server Error" });
        }
    }

    //index route {all listings}
   module.exports.index=async(req,res)=>{
    const  allListings= await Listing.find({});
       res.render("listings//index.ejs",{allListings} );
   }

  // search 
   module.exports.searchListingsPage = async (req, res) => {
    try {
        let { query } = req.query;
        let searchResults = await Listing.find({
            title: { $regex: query, $options: "i" } // Case-insensitive search
        });

        res.render("listings/searchResults.ejs", { searchResults, query });
    } catch (error) {
        console.error("Error searching listings:", error);
        res.status(500).send("Internal Server Error");
    }
};
// edit form
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

// individual listing
module.exports.showListing= async(req,res)=>{
   
    let {id}=req.params;
   const listing=await Listing.findById(id)
   .populate({
    path:"reviews",
    populate:{
      path:"author",
    },
  }).populate("owner");
   if (!listing) {
    req.flash("error","Listing you want to see not exist");
    res.redirect("/listings");
 }
//  console.log(listing);
 res.render("listings/show.ejs",{listing})
 }


 module.exports.createListing=async(req,res,next)=>{
   let url=req.file.path;
   let filename=req.file.filename;
   let category = req.query.category;
    const newListing= new Listing(req.body.listing);
    
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   await newListing.save();
   
    req.flash("success","New Listing Created");
     res.redirect("/listings");
    
   }

   module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
  const listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","listing you requested does not exist");
    res.redirect("/listings")
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs",{listing, originalImageUrl});

}

module.exports.updateListing=async(req,res)=>{

     let {id}=req.params;
  let listing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
  }
     req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
 }

module.exports.deleteListing=async(req,res)=>{
  let {id}=req.params;
 let deletedListing=await  Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 req.flash("success","Listing Deleted");
 res.redirect("/listings");
}