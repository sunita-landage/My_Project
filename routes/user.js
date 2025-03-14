const express=require("express");
const { register } = require("../models/review");
const User=require("../models/user.js");
const WrapAsync = require("../utlis/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router=express.Router();
const userController=require("../controllers/users.js")



router.route("/signup")
.get(userController.renderSignupForm)
.post(WrapAsync( userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',
        failureFlash:true}),userController.login)


//logout
router.get("/logout",userController.logout);

module.exports=router;