const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }]
    },
    { timestamps: true }
)

const user = mongoose.model('User', loginSchema)

module.exports = user