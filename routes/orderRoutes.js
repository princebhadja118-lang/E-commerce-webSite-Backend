const express = require("express");
const router = express.Router();

const {createOrder, getAllOrders, getOrders} = require("../controllers/order.controller");
const authMiddleWare = require("../middleware/authMiddleware")



router.post("/create-order", authMiddleWare, createOrder);
router.get("/get-orders/:userId", getAllOrders);
router.get("/all-orders", getOrders);

module.exports = router;
