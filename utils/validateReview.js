const { reviewSchemaValidator } = require("../schemaValidator/schemaValidator");

const validateReview = (req, res, next) => {
  const { error } = reviewSchemaValidator.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message, 400);
  }
  next();
};

module.exports = { validateReview };