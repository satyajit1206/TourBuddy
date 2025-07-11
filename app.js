if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const ejsMate = require("ejs-mate");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const methodOverride = require("method-override");
const placesRoute = require("./routes/places.route");
const User = require("./models/user.model");
const flash = require("connect-flash");
const saveRedirectUrl = require("./utils/redirectUrl");
const http = require("http");
const server = http.createServer(app);

// Socket.IO connection handling
require("./socket/socket")(server);

// MongoDB URI
const dbUrl = process.env.ATLAS_DB_URL;

// Connect To Database
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//Milddleware setup
app.use(cookieParser());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set ejs as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

// Express Session Options
const options = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(options));

// Connect Flash
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  done(null, user.id); // Store user id in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Find user by id
    done(null, user); // Pass user to request
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If user does not exist, create a new user
          const username = profile.displayName || null; // Use displayName as username if available

          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: username, // Optionally set username if available
            isVerified: true, // Google OAuth users are verified by default
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Middleware to make flash messages available to views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Routes for Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  saveRedirectUrl,
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    req.flash("success", "Welcome to TourBuddy!");
    const redirectUrl = res.locals.redirectUrl || "/places";
    res.redirect(redirectUrl);
  }
);

// routes
app.get("/", (req, res) => {
  res.redirect("/places");
});

// Chat route
app.use("/community", require("./routes/community.route"));

// places routes
app.use("/places", placesRoute);

//ai route
app.use("/ai", require("./routes/ai.route"));

// user routes
app.use("/users", require("./routes/users.route"));

// review routes
app.use("/places/:id/reviews", require("./routes/review.route"));

// Catch-all for 404 errors
app.all("*", (req, res, next) => {
  next(new Error("Page Not Found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
  // console.log(err);
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("./places/error.ejs", { status, message });
});

// Start Server
server.listen(port, () => {
  console.log("Server started on port " + port);
});
