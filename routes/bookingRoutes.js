const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");

//import router from "./listing";

// Show booking form
router.get("/listings/:id/book", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing || listing.booked) {
        req.flash("error", "Listing is not available.");
        return res.redirect("/listings/" + req.params.id);
    }
    res.render("bookings/new", { listing });
});





//handel booking

router.post("/listings/:id/book", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing || listing.booked) {
            req.flash("error", "Listing is already booked.");
            return res.redirect("/listings/" + req.params.id);
        }

        console.log("✅ Found Listing:", listing); // Debugging

        const checkInDate = new Date(req.body.checkInDate);
        const checkOutDate = new Date(req.body.checkOutDate);

        const booking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            totalPrice: listing.price * ((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
        });

        console.log("📌 Booking Data Before Saving:", booking); // Debugging

        await booking.save();  
        console.log("✅ Booking saved in DB");

        const updatedListing = await Listing.findByIdAndUpdate(
            listing._id,
            { booked: true },
            { new: true }
        );

        console.log("✅ Booking Saved, Listing Updated:", updatedListing); // Debugging

        req.flash("success", "Booking confirmed!");
        res.redirect("/listings/" + listing._id);
    } catch (error) {
        console.error("❌ Booking Error:", error);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings/" + req.params.id);
    }
});





// router.get("/bookings", async (req, res) => {
//     try {
//         const bookings = await Booking.find()
//             .populate("user")
//             .populate("listing");

//         // console.log("Fetched Bookings:", JSON.stringify(bookings, null, 2)); // ✅ JSON format me print karega
//   console.log(bookings);
//         const listing = await Listing.find({});

//         res.render("bookings/bookings.ejs", { bookings, listing });
//     } catch (error) {
//         console.error("Error fetching bookings:", error);
//         res.status(500).send("Error fetching bookings");
//     }
// });



router.get("/bookings", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // ✅ Logged-in user ki ID
        const bookings = await Booking.find({ user: userId }) // ✅ Sirf usi user ki bookings fetch karo
            .populate("listing") // ✅ Listing details include karo
            .populate("user");   // ✅ User details include karo

        res.render("bookings/bookings.ejs", { bookings });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/bookings/:id/delete", isLoggedIn, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);

        // ✅ Ensure only the user who booked can delete
        if (!booking || booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized");
        }

        await Booking.findByIdAndDelete(bookingId);
        res.redirect("/bookings"); // ✅ Redirect to bookings page after deletion
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;







