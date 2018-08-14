var generateMessage = (from, message) =>{
    return {
        from,
        message,
        createAt: new Date()
    };
};

var generateLocationMessage = (from, latitude, longitude) =>{
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createAt:  new Date()
    }
};

module.exports = {
    generateMessage,
    generateLocationMessage
}