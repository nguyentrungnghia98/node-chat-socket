var generateMessage = (from, message) => {
  return {
    message,
    from,
    createAt: new Date()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    from,
    createAt: new Date()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};
