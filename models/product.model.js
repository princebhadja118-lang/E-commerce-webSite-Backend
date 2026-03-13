const mongoose=  require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    img: {
        type: String
    },
    category: {
        type: String,
        required: true
    }
},{ timestamps: true });


module.exports = mongoose.model("Product", productSchema);
