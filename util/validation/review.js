const { body, validationResult } = require("express-validator");

const reviewValidationRules = [
  body("movie_id")
    .notEmpty()
    .withMessage("Movie ID is required")
    .isMongoId()
    .withMessage("Invalid Movie ID format"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .isString()
    .withMessage("Comment must be a string")
    .isLength({ min: 10 })
    .withMessage("Comment must be at least 10 characters long"),
];

const validateReview = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  reviewValidationRules,
  validateReview,
};
