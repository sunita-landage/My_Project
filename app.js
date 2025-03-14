if(process.env.NODE_ENV!="production")
{
  require('dotenv').config();
}


const express=require("express");
const  app=express();
const port=8081;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override") ;
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utlis/WrapAsync.js");
const ExpressError=require("./utlis/ExpressError.js");
const Review=require("./models/review.js");
const listings=require("./routes/listing.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const userRouter=require("./routes/user.js");
const reviews=require("./routes/review.js")



app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



// const MONGO_URL="mongodb://127.0.0.1:27017/HotelDb";
const dbUrl=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRETE
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error in mongo session store",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRETE,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000 ,  //1 week expires
    maxAge:7*24*60*60*1000 ,
    httpOnly:true,
   } ,
};
// app.get("/",(req,res)=>{
//   res.send(" i am root");
// })


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
   next();
})



app.get("/demouser",async(req,res)=>{
  let fakeuser=new User({
    email:"student@gmail.com",
    username:"delta_student"
  });
 let registeredUser= await User.register(fakeuser,"hello");
 res.send(registeredUser);
})



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.use("/",userRouter);



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.render("listings/error.ejs",{err});
  // res.status(statusCode).send(message);
})

app.listen(port,()=>{
   console.log(`App is running on port ${port}`);
})