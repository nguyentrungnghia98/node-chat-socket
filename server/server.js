var async = require('asyncawait/async');
var await = require('asyncawait/await');
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const { mongoose } = require("./db/mongoose");
require("./models/rooms");
require("./models/users");
const Room = mongoose.model("rooms");

const publicPath = path.join(__dirname, "../public");
var users = new Users();
app.use(express.static(publicPath));
const port = process.env.PORT || 3100;

var saveMessage = (content,roomName)=>{
  Room.findOne({name: roomName}).then(room=>{
    room.contents.push(content);
    room.save();
  });
}
io.on("connection", function(socket) {
  socket.on("initRoomList", function() {
    Room.find({}).then(rooms => {
      socket.emit("createRooms", rooms);
    });
  });
  socket.on("createNewRoom",async function(roomName) {
    var room = new Room({
      name: roomName
    });
    await room.save();
  });

  socket.on("join",async function(param, callback) {
    if (!isRealString(param.name) || !isRealString(param.room)) {
      callback("Name or Room is not valid");
    } else {
      room = param.room;
      //init room content
      await Room.findOne({ name: param.room }).then(room => {
        socket.emit("initRoomMessage", room.contents);
      });
      //welcom message
      socket.join(param.room);

      users.removeUser(socket.id);
      users.addUser(socket.id, param.name, param.room);

      io.to(param.room).emit("update user", users.getListUsers(param.room));
      socket.emit(
        "welcom message",
        generateMessage("Admin", `Welcom to the chat app`)
      );
      const content = generateMessage("Admin", `${param.name} has joined`);
      saveMessage(content, param.room);
      socket.broadcast
        .to(param.room)
        .emit(
          "welcom message",
          content
        );

      callback();
    }
  });
  socket.on("send message", message => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.message)) {
      const content = generateMessage(user.name, message.message);     
      saveMessage(content, user.room);
      io.to(user.room).emit("render message", content);
    }
  });
  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);
    if (user) {
      const content = generateLocationMessage("Simon", coords.latitude, coords.longitude);
      saveMessage(content, user.room);
      io.to(user.room).emit(
        "render location message",
        content
      );
    }
  });
  socket.on("disconnect", function() {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(room).emit("update user", users.getListUsers(room));
      const content = generateMessage("Admin", `${user.name} has left`);
      saveMessage(content, room);
      socket.broadcast.emit(
        "welcom message",
        content
      );
    }
  });
});

http.listen(port, () => {
  console.log("Connect to server via port ", port);
});
