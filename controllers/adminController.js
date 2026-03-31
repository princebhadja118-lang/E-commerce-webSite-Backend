const User = require("../models/User");
const Product = require("../models/product.model");
const Orders = require("../models/Order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler")


const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
});

//  ***************User***************

// ADMIN ADD USER
exports.adminAddUser = asyncHandler(async (req, res) => {

  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword, role });
    
  const token = generateToken(user);
  const useWithoutPassword = user.toObject();
  delete useWithoutPassword.password;

  res.status(201).json({ success: true, message: "User created successfully", token, user: useWithoutPassword });
});

// ADMIN UPDATE USER
exports.adminUpdateUser = asyncHandler(async (req, res, ) => {
    if (req.body.role && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to change role" });
    }

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
});

// GET ALL USERS
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  const totalUsers = await User.countDocuments();
  res.json({ users, totalUsers });
});

// DELETE USER
exports.deleteUser = asyncHandler(async (req, res) => {
  
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "You cannot delete yourself" });
  }

  const user = await User.findByIdAndDelete(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ success: true, user });

});

// *************Products*************

//Add Product
exports.createProduct = asyncHandler(async (req, res) => {

  const { title, brand, price, discount, img, category, stock } = req.body;

  if (!title|| !price) {
    return res.status(400).json({ message: "Title and price are required" });
  }

  const product = await Product.create({
    title,
    brand,
    price,
    discount,
    img,
    category,
    stock,
  });
  res.status(201).json({ success: true, product });
});

//get all Product in ADMIN 
exports.getAdminProducts = asyncHandler(async (req, res) => {
    
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

//Update Product
exports.updateProduct = asyncHandler(async (req, res) => {
  const { title, brand, price, discount, img, category, stock } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id, 
    {title, brand, price, discount, img, category, stock }, 
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
});

//delete product 
exports.deleteProduct = asyncHandler(async (req, res) => {
   
  const product = await Product.findByIdAndDelete(req.params.id);
  if(!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json({ success: true, product });
});

// **************Orders**************

//get all Orders
exports.getOrders = asyncHandler(async (req, res) => {

  const orders = await Orders.find()

  const revenue = await Orders.aggregate([
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  res.json({ success: true, orders, revenue: revenue[0]?.total || 0 });
});
