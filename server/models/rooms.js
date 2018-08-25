const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  contents: [
    {
      message: {
        type: String
      },
      url: {
        type: String
      },
      from: {
        type: String
      },
      createAt: {
        type: String
      }
    }
  ]
});

mongoose.model("rooms", roomSchema);
