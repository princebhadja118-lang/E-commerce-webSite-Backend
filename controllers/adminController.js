const User = require("../models/User");
const bcrypt = require("bcrypt");
const Product = require("../models/product.model");
const Orders = require("../models/Order");
const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// ADMIN ADD USER
exports.adminAddUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });

    const token = generateToken(user);
    res.status(201).json({ success: true, message: "User created successfully", token, user });
  } catch (error) {
    next(error);
  }
};


// ADMIN UPDATE USER
exports.adminUpdateUser = async (req, res, next) => {
  try {
    const { username, email, role } = req.body;
    const updateData = { username, email, role };
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateData.password = hashedPassword;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    const totalUsers = await User.countDocuments();
    res.json({ users, totalUsers });
  } catch (error) {
    next(error);
  }
};

// DELETE USER
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

//Add Product
exports.createProduct = async (req, res) => {
    try{
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//get all Product in ADMIN 
exports.getAdminProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//Update Product
exports.updateProduct = async (req, res) => {
    try{
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({
                success: true,
                product
            });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//delete product 
exports.deleteProduct = async (req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            product
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


//get all Orders
exports.getOrders = async(req,res) => {
    try {
        const orders = await Orders.find();
        
        const revenue = await Orders.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        res.json({
            success: true,
            orders,
            revenue
        });

    } catch(err) {
        res.status(500).json({error: err.message});
    }
}
