const Review = require("../models/reviews.model");

async function isReviewOwner(req, res, next) {
  const { reviewId } = req.params; // Access the reviewId directly from req.params
  const review = await Review.findById(reviewId); // Find the review by its ID

  if (!review.createdBy.equals(res.locals.currentUser._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect("/listings/" + req.params.id);
  }
  next();
}

module.exports = isReviewOwner;
