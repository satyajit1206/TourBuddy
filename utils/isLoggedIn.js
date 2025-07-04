function isLoggedIn(req, res, next) {
  // console.log("req.user= ",req.user);
  // console.log(req.originalUrl);
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  req.flash("error", "You must be signed in first!");
  res.redirect("/users/login");
}

module.exports = isLoggedIn;
