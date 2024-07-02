// validator for mongodb object ids

const { param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const objectIdValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("Object ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Object ID"),
];

const validateObjectId = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { objectIdValidationRules, validateObjectId };
