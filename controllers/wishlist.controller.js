const User = require("../models/User");
const Product = require("../models/product.model");

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) return res.status(400).json({ message: "productId is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found. Please login again." });

    const alreadyIn = user.wishlist.some((id) => id.toString() === productId.toString());
    if (alreadyIn) return res.status(400).json({ message: "Already in wishlist" });

    user.wishlist.push(productId);
    await user.save();

    const updated = await User.findById(userId).populate("wishlist");
    res.json({ success: true, message: "Added to wishlist", wishlist: updated.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found. Please login again." });

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({ success: true, message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found. Please login again." });

    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
