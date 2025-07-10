const express = require("express");
const router = express.Router();
const saveRedirectUrl = require("../utils/redirectUrl");
const usersController = require("../controller/users.controller");

// Register
router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", usersController.registerUser);

// Email Verification
router.get("/verify-email", usersController.verifyEmail);

// Login
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Login route with success and failure flash messages and redirect
router.post("/login", saveRedirectUrl, usersController.loginUser);

// Logout
router.get("/logout", usersController.logoutUser);

module.exports = router;
