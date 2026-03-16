const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },

    products: [
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "product",
            },
            quantity:Number,
            img:String,
            title:String,
            price:Number,
            
        }
    ],
    date:{
            type: Date,
            default: Date.now
        },
        time:{
            type: String,

        },
    totalAmount:Number,

    shippingAddress:{
        name:String,
        email:String,
        phone:Number,
        address:String,
        city:String,
        state:String,
        pincode:Number,
        country:String
    },
    paymentID:Number,
}, {timestamps: true} )

module.exports = mongoose.model("order", orderSchema)
