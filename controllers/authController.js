const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new ApiError(400, "Email already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });

    const token = generateToken(user);
    res.status(201).json({ success: true, message: "User created successfully", token, user });
  } catch (error) {
    next(error);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = generateToken(existingUser);
    res.json({
      success: true,
      message: "Login Successfully",
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

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

    const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    if (req.user.id !== req.params.id && req.user.role !== "admin")
      return res.status(403).json({ message: "You are not authorized to update this user" });

    if (!username || !email || !role)
      return res.status(400).json({ message: "All fields are required" });

    if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const updateuser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updateuser) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: "User updated successfully",
      user: { id: updateuser._id, username: updateuser.username, email: updateuser.email, role: updateuser.role },
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// DELETE USER
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can delete users" });

    const deleteduser = await User.findByIdAndDelete(req.params.id);
    if (!deleteduser) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};