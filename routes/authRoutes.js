const User = require('../models/User');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware')
const validate = require("../middleware/validate.middleware")
const {registerSchema, loginSchema} = require("../validators/auth.validator")


// REGISTER
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return next(new ApiError(400, "Email or username already exists"));
    }

    const user = await User.create({ username, email, password });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user
    });

  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post('/login', validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }
        else if (existingUser.password !== password) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role
            }

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//update
router.put('/admin/update/:id', authMiddleware, async (req, res) => {
    try {
        const { username, email, role } = req.body;

         const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        if (req.user.id !== req.params.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this user" })
        }
        const updateuser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role },
            { new: true, runValidators: true }
        ).select('-password');
        if(!username || !email || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        else if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        else if (!updateuser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            success: true,
            message: "User updated successfully",
            user: {
                id: updateuser._id,
                username: updateuser.username,
                email: updateuser.email,
                role: updateuser.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//user Data 
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
})

//Delete 
router.delete('/admin/delete/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete users' })
        }
        const deleteduser = await User.findByIdAndDelete(req.params.id)
        

        if (!deleteduser) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        })

    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = router;