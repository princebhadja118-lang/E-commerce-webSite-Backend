const express = require("express");
const router = express.Router();

const {createOrder, getAllOrders} = require("../controllers/order.controller");
const authMiddleWare = require("../middleware/authMiddleware")

router.post("/create-order", authMiddleWare, createOrder);
router.get("/get-orders/:userId", getAllOrders);

module.exports = router;
