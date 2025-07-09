const Place = require("../models/places.model");
const Review = require("../models/reviews.model");
const cloudinary = require("../config/cloudConfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.addNewPlace = async (req, res) => {
  const { title, description, location } = req.body;

  // Geocoding the location
  let response = await geocodingClient
    .forwardGeocode({
      query: location,
      limit: 1,
    })
    .send();

  const newPlace = new Place({
    title,
    description,
    location,
    geometry: response.body.features[0].geometry,
    addedBy: req.user._id,
  });

  // Handle single or multiple image uploads
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      newPlace.images.push({ url: result.secure_url, imageId: result.public_id });
    }
  }

  await newPlace.save();
  req.flash("success", "Successfully created a new place");
  res.redirect("/places");
};

module.exports.getPlaceById = async (req, res) => {
  let place = await Place.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "createdBy" } })
    .populate("addedBy");

  if (!place) {
    req.flash("error", "Cannot find that place");
    return res.redirect("/places");
  }

  place.reviews.sort((a, b) => b.createdAt - a.createdAt);

  // Transform all image URLs
  const transformedImageUrls = place.images.map(image =>
    cloudinary.url(image.imageId, { transformation: [{ width: 1000, height: 600, crop: "fill" }] })
  );

  res.render("./places/show.ejs", { place, transformedImageUrls });
};



module.exports.renderEditPlaceFrom = async (req, res) => {
  let place = await Place.findById(req.params.id);
  if (!place) {
    req.flash("error", "Cannot find that place");
    return res.redirect("/places");
  }
  res.render("./places/edit.ejs", { place: place });
};

module.exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
      req.flash("error", "Place not found");
      return res.redirect("/places");
    }

    // Handle the deletion of selected images
    if (req.body.removeImages && req.body.removeImages.length > 0) {
      for (const imageId of req.body.removeImages) {
        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(imageId);
        // Remove image from the place's images array
        place.images = place.images.filter(img => img.imageId !== imageId);
      }
    }

    // Handle the addition of new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        place.images.push({ url: result.secure_url, imageId: result.public_id });
      }
    }

    // Update the location and geocode if location is provided
    if (req.body.location && req.body.location !== place.location) {
      try {
        let response = await geocodingClient
          .forwardGeocode({
            query: req.body.location,
            limit: 1,
          })
          .send();

        place.location = req.body.location;
        place.geometry = response.body.features[0].geometry;
      } catch (error) {
        console.error("Geocoding error:", error);
        req.flash("error", "Failed to update location");
        return res.redirect("/places/" + id + "/edit");
      }
    }

    // Update other fields
    place.title = req.body.title || place.title;
    place.description = req.body.description || place.description;

    // Save the updated place
    await place.save();

    req.flash("success", "Successfully updated place");
    res.redirect("/places/" + id);
  } catch (err) {
    console.error("Update place error:", err);
    req.flash("error", "Failed to update place");
    res.redirect("/places/" + req.params.id + "/edit");
  }
};

module.exports.searchPlace = async (req, res) => {
  let { query } = req.query;
  let places = await Place.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  });
  res.render("./places/home.ejs", { places: places });
};

module.exports.deletePlace = async (req, res) => {
  try {
    // Find and delete the place by ID
    const place = await Place.findById(req.params.id);

    if (!place) {
      req.flash("error", "Cannot find that place");
      return res.redirect("/places");
    }

    // Delete all associated images from Cloudinary
    for (const image of place.images) {
      await cloudinary.uploader.destroy(image.imageId);
    }

    // Remove the place from the database
    await Place.findByIdAndDelete(req.params.id);

    // Delete associated reviews
    await Review.deleteMany({ _id: { $in: place.reviews } });

    req.flash("success", "Successfully deleted place");
    res.redirect("/places");
  } catch (error) {
    console.error("Error deleting place:", error);
    req.flash("error", "Failed to delete place. Please try again.");
    res.redirect("/places");
  }
};
