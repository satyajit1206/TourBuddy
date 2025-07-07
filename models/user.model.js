const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents with `null` values for this field
  },
  email: {
    type: String,
    required: true, 
    unique: true
  },
  googleId: {
    type: String,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false // Indicates if the user's email is verified
  },
  verificationToken: {
    type: String,
    required: false // Stores the email verification token
  }
});

// Plugin to handle password hashing and salting
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
