const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/wishlist.controller");

router.post("/add", authMiddleware, addToWishlist);
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);
router.get("/get", authMiddleware, getWishlist);

module.exports = router;
