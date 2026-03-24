const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const {
  register,
  login,
  adminAddUser,
  adminUpdateUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/authController");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/admin/add", adminAddUser);
router.put("/admin/update/:id", authMiddleware, adminUpdateUser);
router.get("/data", getAllUsers);
router.delete("/admin/delete/:id", authMiddleware, deleteUser);

module.exports = router;
