const Joi = require("joi");

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  imageId: Joi.string().required(),
});

const placeSchemaValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  images: Joi.array().items(imageSchema).optional(), // Handles array of images
  removeImages: Joi.array().items(Joi.string().required()).optional(), // Handles the array of image IDs to remove
  addedBy: Joi.string().optional(), // Adjusted according to your schema
  reviews: Joi.array().items(Joi.string()).optional(), // Adjusted according to your schema
  geometry: Joi.object({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(), // Adjust if needed
  }),
});

const reviewSchemaValidator = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().required(),
});

module.exports = { placeSchemaValidator, reviewSchemaValidator };
