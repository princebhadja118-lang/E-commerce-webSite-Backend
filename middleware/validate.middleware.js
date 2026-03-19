const ApiError = require("../utils/ApiError");

const validate = (scheme) => (req, res, next) => {
    const { error } = scheme.validate(req.body, {
        abortEarly: false,
    });

    if(error) {
        const message = error.details.map((err) => err.message).join(",");
        return next(new ApiError(400, message));
    }
    next();
}

module.exports = validate;
