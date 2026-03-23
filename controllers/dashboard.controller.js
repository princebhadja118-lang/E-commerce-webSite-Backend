const Order = require("../models/Order");
const User = require("../models/User");

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