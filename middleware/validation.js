const { body, query, validationResult } = require("express-validator");

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
}

const validateAddSchool = [

  // Validate school name
  body("name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string")
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters")
    .trim(),

  // Validate address
  body("address")
    .notEmpty().withMessage("Address is required")
    .isString().withMessage("Address must be a string")
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters")
    .trim(),

  // Validate latitude
  body("latitude")
    .notEmpty().withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  // Validate longitude
  body("longitude")
    .notEmpty().withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  handleValidationErrors
];

const validateListSchools = [

  // Validate latitude query parameter
  query("latitude")
    .notEmpty().withMessage("Latitude query parameter is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  // Validate longitude query parameter
  query("longitude")
    .notEmpty().withMessage("Longitude query parameter is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  handleValidationErrors
];

module.exports = {validateAddSchool, validateListSchools};