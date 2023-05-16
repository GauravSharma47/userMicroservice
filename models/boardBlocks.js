const mongoose = require("mongoose");
// mongoose.set("debug", true);
const BoardBlock = mongoose.model("BoardBlock", {
  name: {
    type: String,
    trim: true,
    required: [true,'User name required'],
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    // required: [true, "User phone number required"],
  },
  email:{
    type: String,
    required: [true, "User email required"],
    unique: [true, "Email Exist"],
  },
  password:{
    type: String,
    required: [true, "User password required"],
  }
});

module.exports = { BoardBlock };
