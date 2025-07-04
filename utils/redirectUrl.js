const saveRedirectUrl = (req, res, next) => {
  // console.log(req);
  // console.log(req.session.returnTo);
  
  res.locals.redirectUrl = req.session.returnTo;
  // console.log(res.locals.redirectUrl);
  next();
};

module.exports = saveRedirectUrl;
