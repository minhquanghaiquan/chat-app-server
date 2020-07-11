const express = require("express");
const errorHandlers = require('./handlers/errorHandler')
const app = express();
const mongoose  = require('mongoose');
const Chatroom = mongoose.model('Chatroom');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Cross Origin
app.use(require("cors")());


//Bring in the routes
app.use('/user',require('./routes/user'));
app.use('/chatroom',require('./routes/chatroom'));

app.post('/getroomname', async (req, res)=> {

  const room = await Chatroom.findOne({_id:req.body.chatroomId})
  console.log(room.name);
  res.json({
    roomName: room.name,
  });
})





//Setup Error Handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENVD === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}




module.exports = app;