const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");
const publicPath = path.join(__dirname, "../public");
var users = new Users();
app.use(express.static(publicPath));
const port = process.env.PORT || 3100;

io.on("connection", function(socket) {
  socket.on("join", function(param, callback) {
    if (!isRealString(param.name) || !isRealString(param.room)) {
      callback("Name or Room is not valid");
    } else {
      room = param.room;
      socket.join(param.room);

      users.removeUser(socket.id);
      users.addUser(socket.id, param.name, param.room);

      io.to(param.room).emit("update user", users.getListUsers(param.room));
      socket.emit(
        "welcom message",
        generateMessage("Admin", `Welcom to the chat app`)
      );
      socket.broadcast
        .to(param.room)
        .emit(
          "welcom message",
          generateMessage("Admin", `${param.name} has joined`)
        );

      callback();
    }
  });
  socket.on("send message", message => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.message)) {
      io.to(user.room).emit(
        "render message",
        generateMessage(user.name, message.message)
      );
    }
  });
  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "render location message",
        generateLocationMessage("Simon", coords.latitude, coords.longitude)
      );
    }
  });
  socket.on("disconnect", function() {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(room).emit("update user", users.getListUsers(room));
      socket.broadcast.emit(
        "welcom message",
        generateMessage("Admin", `${user.name} has left`)
      );
    }
  });
});

http.listen(port, () => {
  console.log("Connect to server via port ", port);
});
