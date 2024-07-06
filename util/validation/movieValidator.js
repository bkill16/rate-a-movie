// movie validation using express validator

const { body, validationResult } = require("express-validator");

const movieValidationRules = [
    body("title")
        .notEmpty()
        .withMessage("Movie title is required")
        .isString()
        .withMessage("Movie title must be a string")
        .isLength({ min: 3 })
        .withMessage("Movie title must be at least 3 characters long"),
    
    body("director")
        .notEmpty()
        .withMessage("Movie director is required")
        .isString()
        .withMessage("Movie director must be a string")
        .isLength({ min: 3 })
        .withMessage("Movie director must be at least 3 characters long"),
    
    body("production_company")
        .notEmpty()
        .withMessage("Movie production company is required")
        .isString()
        .withMessage("Movie production company must be a string")
        .isLength({ min: 3 })
        .withMessage("Movie production company must be at least 3 characters long"),
    
    body("distribution_company")
        .notEmpty()
        .withMessage("Movie distribution company is required")
        .isString()
        .withMessage("Movie distribution company must be a string")
        .isLength({ min: 3 })
        .withMessage("Movie distribution company must be at least 3 characters long"),
    
    body("US_release_date")
        .notEmpty()
        .withMessage("Movie release date is required")
        .custom((value) => {
            // Check if the date format is valid
            const datePattern = /^[A-Z][a-z]+\s\d{1,2},\s\d{4}$/;
            if (!datePattern.test(value)) {
                throw new Error("Movie release date must be in the format 'May 19, 1999'");
            }
            
            // Parse the date and check if it's a valid date object
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error("Movie release date must be a valid date");
            }
    
            // Check if the date is not in the future
            if (date > new Date()) {
                throw new Error("Movie release date cannot be in the future");
            }
    
            return true;
        }),

    body("running_time")
        .notEmpty()
        .withMessage("Movie running time is required")
        .isString()
        .withMessage("Movie running time must be a string")
        .isLength({ min: 4 })
        .withMessage("Movie running time must be at least 4 characters long"),

    body("audience_rating")
        .notEmpty()
        .withMessage("Movie audience rating is required")
        .isString()
        .withMessage("Movie audience rating must be a string")
        .isLength({ min: 1 })
        .withMessage("Movie audience rating must be at least 1 character long"),
];

const validateMovie = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
  
  module.exports = {
    movieValidationRules,
    validateMovie,
  };