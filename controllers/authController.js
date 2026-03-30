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
exports.getUsers = async (req,res)=>{
  try{
    const user = await User.find();
  res.status(201).json(user);
  }catch(err){
    console.log(err)
    res.status(500).json({
      success:false,
      message: "Internet error"
    })
  }
}