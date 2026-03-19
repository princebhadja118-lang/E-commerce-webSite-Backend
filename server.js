const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productroutes")
const paymentRoutes = require("./routes/paymentRoutes")
const orderRoutes = require("./routes/orderRoutes")
const errorHandler = require("./middleware/error.middleware")
require("dotenv").config()

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json());

connectDB()
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.listen(5000, () => {
    console.log("Server running on port 5000");

})