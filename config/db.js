const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const res = await mongoose.connect("mongodb+srv://princebhadja118_db_user:YtfRjep8BDEL3zU8@projectwithbacken.jlqqk8u.mongodb.net/agrochemicals");
        if (res) {
            console.log("DB connected");

        }
    } catch (err) {
        console.log("Server error", err);

    }
}

module.exports = connectDB;