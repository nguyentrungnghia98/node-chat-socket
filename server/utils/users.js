class Users {
  constructor() {
    this.users = [];
  }
  getListUsers(room) {
    return this.users.filter(e => e.room === room).map(user => user.name);
  }
  getUser(id) {
    return this.users.find(e => e.id === id);
  }
  addUser(id, name, room) {
    if (this.users.findIndex(e => e.id === id) === -1) {
      const user = {
        id,
        name,
        room
      };
      this.users.push(user);
      return user;
    }
    return;
  }
  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(e => e.id !== id);
    }
    return user;
  }
}
module.exports = { Users };
