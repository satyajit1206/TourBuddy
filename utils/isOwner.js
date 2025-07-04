const Place = require("../models/places.model");

module.exports = async (req, res, next) => {
  const place = await Place.findById(req.params.id);
  if (place.addedBy._id.equals(res.locals.currentUser._id)) {
    next();
  } else {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/places/${id}`);
  }
};
