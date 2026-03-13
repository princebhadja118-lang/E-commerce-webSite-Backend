const express = require("express");
const {createOrder} = require("../controllers/order.controller")
const {getAllOrders} = require("../controllers/order.controller")


const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-orders/:userId", getAllOrders);

module.exports = router;
