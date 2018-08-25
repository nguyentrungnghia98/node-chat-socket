var socket = io();
var addActivityItem = () => {
  document.getElementById("createInput").classList.remove("hidden");
};

var activities = document.getElementById("myList");

var options = activities.querySelectorAll("option");
var count = options.length;
if (typeof count === "undefined" || count < 2) {
  addActivityItem();
}

activities.addEventListener("change", function() {
  if (activities.value == "new") {
    addActivityItem();
  } else {
    document.getElementById("createInput").classList.add("hidden");
  }
});

socket.on("connect", function() {
  //load exist room
  socket.emit("initRoomList");
});

socket.on("createRooms", function(rooms) {
  const html = rooms.reduce(
    (cal, cur) => cal + `<option value="${cur.name}">${cur.name}</option>`,
    ""
  );
  document.getElementById("myList").insertAdjacentHTML("afterbegin", html);
});
document.getElementById("join").addEventListener("click", () => {
  if (activities.value == "new") {
    const newRoom = document.getElementById("createInput").value;
    socket.emit("createNewRoom", newRoom);
  } else {
    document.getElementById("createInput").value = activities.value;
  }
});
