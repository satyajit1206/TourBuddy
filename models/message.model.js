const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  room: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of usernames who liked the message
  dislikedBy: [{ type: String }], // Array of usernames who disliked the message
  createdAt: { type: Date, default: Date.now },
});


// Create and export the Message model
module.exports = mongoose.model("Message", messageSchema);
