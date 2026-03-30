const Order = require("../models/Order");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.getDashboardStats = async (req, res) => {
  try {
    // Revenue + Orders
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      }
    ]);

    // Users
    const userStats = await User.aggregate([
      {
        $match: { role: "user" }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          users: { $sum: 1 }
        }
      }
    ]);

    // Merge Data
    const combined = orderStats.map(order => {
      const user = userStats.find(u => u._id === order._id);

      return {
        month: order._id,
        revenue: order.revenue,
        orders: order.orders,
        users: user ? user.users : 0
      };
    });

    // Sort by month
    combined.sort((a, b) => a.month - b.month);

    res.json(combined);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Edit Profile 
exports.editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;

    // Only update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    console.log("Error editing profile:", err);
    res.status(500).json({ error: err.message });
  }
};