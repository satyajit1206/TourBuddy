const express = require("express");
const router = express.Router({ mergeParams: true });
const isLoggedIn = require("../utils/isLoggedIn");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../utils/validateReview");
const reviewController = require("../controller/reviews.controller");

router.post(
  "/add",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
