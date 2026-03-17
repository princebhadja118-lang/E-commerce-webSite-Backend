const express = require("express");
const {createOrder} = require("../controllers/order.controller");
const {getAllOrders} = require("../controllers/order.controller");
const {getOrders} = require("../controllers/order.controller");

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-orders/:userId", getAllOrders);
router.get("/all-orders", getOrders);

module.exports = router;
