// actor validation using express validator

const { body, validationResult } = require("express-validator");

const actorValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Actor name is required")
    .isString()
    .withMessage("Actor name must be a string")
    .isLength({ min: 2 })
    .withMessage("Actor name must be at least 2 characters long"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be either 'Male', 'Female', or 'Other'"),

  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const date = new Date(value);
      return date <= new Date();
    })
    .withMessage("Date of birth cannot be in the future"),

  body("dod")
    .custom((value) => {
      if (value === null) {
        return true;
      }
      if (value === "" || value === "null") {
        return false;
      }
      const date = new Date(value);
      return !isNaN(date) && date <= new Date();
    })
    .withMessage(
      "Date of death cannot be empty. Set it to null if not applicable."
    )
    .custom((value) => {
      if (value === null) {
        return true;
      }
      const date = new Date(value);
      return !isNaN(date) && date <= new Date();
    })
    .withMessage(
      "Date of death must be a valid date and cannot be in the future"
    ),

  body("nationality")
    .notEmpty()
    .withMessage("Nationality is required")
    .isString()
    .withMessage("Nationality must be a string")
    .isLength({ min: 2 })
    .withMessage("Nationality must be at least 2 characters long"),
];

const validateActor = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  actorValidationRules,
  validateActor,
};
