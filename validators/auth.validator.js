const joi = require("joi");

const registerSchema = joi.object({
    username: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required()
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required()
})

module.exports = { registerSchema, loginSchema }