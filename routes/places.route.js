const express = require("express");
const router = express.Router();
const Place = require("../models/places.model");
const wrapAsync = require("../utils/wrapAsync");
const { validatePlace } = require("../utils/validatePlace");
const isLoggedIn = require("../utils/isLoggedIn");
const isOwner = require("../utils/isOwner");
const placesController = require("../controller/places.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let places = await Place.find();
    if (!places) {
      req.flash("error", "No places found");
      return res.redirect("/places");
    }
    res.render("./places/home.ejs", { places });
  })
);

router.get("/add", isLoggedIn, (req, res) => {
  res.render("./places/add.ejs");
});

router.post(
  "/add",
  isLoggedIn,
  upload.array("newImages"), // Allow multiple images
  validatePlace,
  wrapAsync(async (req, res, next) => {
    const files = req.files;
    req.body.images = files.map(file => ({
      url: file.path, // Adjust according to how you handle file URLs
      imageId: file.filename // Adjust according to how you handle file IDs
    }));
    await placesController.addNewPlace(req, res, next);
  })
);

router.get("/search", wrapAsync(placesController.searchPlace));

router.get("/:id", wrapAsync(placesController.getPlaceById));

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(placesController.renderEditPlaceFrom)
);

router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.array("newImages"), // Handle multiple new images
  validatePlace,
  wrapAsync(async (req, res, next) => {
    const files = req.files;
    req.body.images = files.map(file => ({
      url: file.path, // Adjust according to how you handle file URLs
      imageId: file.filename // Adjust according to how you handle file IDs
    }));
    await placesController.updatePlace(req, res, next);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(placesController.deletePlace)
);

module.exports = router;
