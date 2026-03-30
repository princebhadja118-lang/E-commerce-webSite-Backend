const express = require("express")
const { getDashboardStats, editProfile } = require("../controllers/dashboard.controller")
const router = express.Router()

router.get("/stats", getDashboardStats)
router.put("/get-profile/:id", editProfile)

module.exports = router