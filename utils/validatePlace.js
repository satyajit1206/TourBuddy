const { placeSchemaValidator } = require("../schemaValidator/schemaValidator");

const validatePlace = (req, res, next) => {
  const { error } = placeSchemaValidator.validate(req.body, { abortEarly: false }); // Added abortEarly: false to capture all errors
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error.details.map(detail => detail.message).join(', ')
    });
  }
  
  next();
};

module.exports = { validatePlace };
