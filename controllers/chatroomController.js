const mongoose = require("mongoose");
const { param } = require("../routes/user");
const Chatroom = mongoose.model("Chatroom");


//create room
exports.createChatroom = async (req, res) => {
  const { name } = req.body;
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";
  const chatroomExists = await Chatroom.findOne({ name });
  if (chatroomExists) throw "Chatroom with that name already exists!";
  const chatroom = new Chatroom({
    name,
    members: [req.payload.id]
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",
  });
};



//join room
exports.joinRoom = async (req, res) => {
  const { name } = req.body;
 
  
  const room = await Chatroom.findOne({ name });
  if (!room) throw "This room is not available";

  const checkUserInRoom = await Chatroom.find({$and: [{name}, {members: {"$in":[req.payload.id]}}]});
  
  if(checkUserInRoom.length > 0 ) throw "You was in room"

  await Chatroom.findOneAndUpdate({name} ,{$push: { members: req.payload.id}})

  res.json({
    message: "Join in room",
  });
};

//get list room
exports.getAllChatrooms = async (req, res) => {

  const chatrooms = await Chatroom.find({members: {"$in":[req.payload.id]}});

  res.json(chatrooms);
};


//get messages in room 
exports.getMessagesRoom = async (req, res) => {
  const chatroomId = req.params.id;
  const chatrooms = await Chatroom.findOne({ _id: chatroomId });
  res.json(chatrooms.messages);
};



exports.leaveFromRoom = async (req, res) => {
  const { chatroomId } = req.body;

  await Chatroom.findOneAndUpdate({ _id: chatroomId }, {
    $pull: {
      members: req.payload.id
    }},
    {'new': true}
  );

 await Chatroom.remove({members:[]});

  res.json('you left from room');
};