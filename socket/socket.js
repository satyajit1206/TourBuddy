const socketIO = require("socket.io");
const Message = require("../models/message.model"); // Import Message model

module.exports = function (server) {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    // console.log("New user connected");

    socket.on("set username", (username) => {
      socket.username = username;
    });

    socket.on("join category", async (category) => {
      try {
        socket.leaveAll();
        socket.join(category);

        const messages = await Message.find({ room: category })
          .sort({ createdAt: -1 })
          .limit(50);
        socket.emit("load messages", messages.reverse());
      } catch (error) {
        console.error("Error loading messages:", error);
        socket.emit("error", { message: "Failed to load messages" });
      }
    });

    socket.on("chat message", async ({ category, message }) => {
      try {
        const sanitizedMessage = sanitize(message);
        const msg = new Message({
          username: socket.username,
          message: sanitizedMessage,
          room: category,
        });
        await msg.save();
        io.to(category).emit("chat message", msg);
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("like message", async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          if (message.likedBy.includes(socket.username)) {
            message.likes -= 1;
            message.likedBy = message.likedBy.filter(
              (user) => user !== socket.username
            );
          } else if (message.dislikedBy.includes(socket.username)) {
            message.dislikes -= 1;
            message.dislikedBy = message.dislikedBy.filter(
              (user) => user !== socket.username
            );
            message.likes += 1;
            message.likedBy.push(socket.username);
          } else {
            message.likes += 1;
            message.likedBy.push(socket.username);
          }
          await message.save();
          io.to(message.room).emit("update likes", {
            _id: message._id,
            likes: message.likes,
            dislikes: message.dislikes,
          });
        }
      } catch (error) {
        console.error("Error handling like:", error);
        socket.emit("error", { message: "Failed to like message" });
      }
    });

    socket.on("dislike message", async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          if (message.dislikedBy.includes(socket.username)) {
            message.dislikes -= 1;
            message.dislikedBy = message.dislikedBy.filter(
              (user) => user !== socket.username
            );
          } else if (message.likedBy.includes(socket.username)) {
            message.likes -= 1;
            message.likedBy = message.likedBy.filter(
              (user) => user !== socket.username
            );
            message.dislikes += 1;
            message.dislikedBy.push(socket.username);
          } else {
            message.dislikes += 1;
            message.dislikedBy.push(socket.username);
          }
          await message.save();
          io.to(message.room).emit("update likes", {
            _id: message._id,
            likes: message.likes,
            dislikes: message.dislikes,
          });
        }
      } catch (error) {
        console.error("Error handling dislike:", error);
        socket.emit("error", { message: "Failed to dislike message" });
      }
    });

    socket.on("disconnect", () => {
      // console.log(`User ${socket.username} disconnected`);
    });
  });

  function sanitize(message) {
    return message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return io;
};
