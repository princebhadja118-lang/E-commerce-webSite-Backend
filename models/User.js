const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
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
            default: "user"
        },
    },
    { timestamps: true }
)

const user = mongoose.model('User', loginSchema)

module.exports = user