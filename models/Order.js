const { required } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },

    products: {
        type: [{
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "product",
            },
            quantity: { type: Number },
            img: { type: String, required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
        }],
        required: true
    },

    date:{
            type: Date,
            default: Date.now,
            required: true

        },
        time:{
            type: String,
            required: true
            
        },

    totalAmount: { type: Number, required: true },

    shippingAddress: {
        type: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true , maxlength: 10, minlength: 10 },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true, maxlength: 6, minlength: 6 },
            country: { type: String, required: true },
        },
        required: true
    },

    paymentID: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
