const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
  messages: [],
  members: [String]
});

module.exports = mongoose.model("Chatroom", chatroomSchema);