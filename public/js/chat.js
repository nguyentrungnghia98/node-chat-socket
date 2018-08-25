var socket = io();
var param = jQuery.deparam(window.location.search);

var scrollToBottom = () => {
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");

  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
};
var fixMessage = message => {
  const time = moment(message.createAt).format("h:mm a");

  return {
    from: message.from,
    message: text,
    createAt: time
  };
};
var renderMessageUI = message => {
  const time = moment(message.createAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.message,
    from: message.from,
    createdAt: time
  });
  jQuery("#messages").append(html);
  scrollToBottom();
};

var renderLocationMessageUI = message => {
  const time = moment(message.createAt).format("h:mm a");
  var template = jQuery("#message-location-template").html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: time
  });
  jQuery("#messages").append(html);
  scrollToBottom();
};

var renderUserUI = users => {
  const ol = jQuery("<ol></ol>");
  users.forEach(user => {
    var html = `
    <li>${user} </li>`;
    ol.append(html);
  });
  jQuery("#users").html(ol);
};
document.getElementById("message-form").addEventListener("submit", e => {
  e.preventDefault();
  const text = document.getElementById("content-message").value;
  const chat = {
    from: param.name,
    message: text
  };
  document.getElementById("content-message").value = "";
  socket.emit("send message", chat);
});

const locationButton = jQuery("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }
  navigator.geolocation.getCurrentPosition(
    function(location) {
      socket.emit("createLocationMessage", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    },
    function() {
      alert("Unable to fetch location!");
    }
  );
});
socket.on("connect", function() {
  socket.emit("join", param, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    }
  });
});
socket.on("initRoomMessage", function(contents) {
  if (contents) {
    jQuery("#messages").html("");
    contents.forEach(content => {
      if (content.message) {
        renderMessageUI(content);
      } else {
        renderLocationMessageUI(content);
      }
    });
  }
});
socket.on("welcom message", function(message) {
  renderMessageUI(message);
});
socket.on("update user", function(users) {
  renderUserUI(users);
});
socket.on("render message", function(chat) {
  renderMessageUI(chat);
});
socket.on("render location message", function(chat) {
  renderLocationMessageUI(chat);
});
