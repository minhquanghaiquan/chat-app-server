require("dotenv").config();
const mongoose  = require('mongoose');
const jwt = require("jwt-then");
// const Message = mongoose.model("Message");
// const User = mongoose.model("User");



//**Connect to mongoodb**
const connect = mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("conneted to mongo yeahh")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

//*Bring in the models */
require("./models/User");
require("./models/Chatroom");
require("./models/Message");




const app = require('./app');

const server = app.listen(5000, () => {
    console.log("Server listening on port 5000");
  });

//*socket */
const io = require('socket.io')(server)

const Message = mongoose.model('Message');
const User = mongoose.model('User');
const Chatroom = mongoose.model('Chatroom');
//set up  for socket
io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {}
});

io.on('connection', (socket)=> {
    

    //when disconnect
    socket.on('disconnect', () => {
        // console.log('disconnected: ' + socket.userId)
    })

    //when user join in room
    socket.on("joinRoom", ({ chatroomId }) => {
        socket.join(chatroomId);
        console.log("A user joined chatroom: " + chatroomId);
      });
    
    //when user leave room
    socket.on("leaveRoom", ({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);
    });
    
    //Send massage to user
    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
        
        if (message.trim().length > 0) {
            const user = await User.findOne({ _id: socket.userId });
            console.log(chatroomId)
            const newMessage = new Message({
                chatroom: chatroomId,
                user: socket.userId,
                message,
            });
            
            await Chatroom.findOneAndUpdate({_id: chatroomId} ,{$push: {messages: { 
                message,
                name: user.name,
                userId: socket.userId,
            }}})

            io.to(chatroomId).emit("newMessage", {
                message,
                name: user.name,
                userId: socket.userId,
            });
            await newMessage.save();
        }
    });
})