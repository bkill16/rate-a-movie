const { body, validationResult } = require("express-validator");

const maValidationRules = [
  body("movieId")
    .notEmpty()
    .withMessage("MovieId is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("MovieId must be a valid Object ID"),
  body("actorId")
    .notEmpty()
    .withMessage("ActorId is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("ActorId must be a valid Object ID"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string"),
];

const validateMA = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  maValidationRules,
  validateMA,
};
