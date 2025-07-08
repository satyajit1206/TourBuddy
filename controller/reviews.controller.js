const Review = require("../models/reviews.model");
const Place = require("../models/places.model");

module.exports.addReview = async (req, res) => {
  const place = await Place.findById(req.params.id);
  const review = new Review(req.body);
  review.createdBy = req.user._id;
  place.reviews.push(review._id);
  await review.save();
  await place.save();
  req.flash("success", "Review added successfully");
  res.redirect(`/places/${place._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/places/${id}`);
};
