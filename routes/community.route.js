const express = require("express");
const isLoggedIn = require("../utils/isLoggedIn");
const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  const user = req.user;
  res.render("./community/chat.ejs", { user });
});

module.exports = router;
