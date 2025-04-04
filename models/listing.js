const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");


//define schema
const listingSchema=new Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    } ,
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review",
    }
],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}, 
 booked: { type: Boolean, default: false } ,
 category: { type: String,default:"Trending"}
});

//mongoose middleware Delete review after delete listing
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }

});

//export model
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;