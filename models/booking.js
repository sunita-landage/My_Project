const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const bookingSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model("Booking", bookingSchema);


//const Booking = mongoose.model("Booking", bookingSchema);
//module.exports = Booking;
