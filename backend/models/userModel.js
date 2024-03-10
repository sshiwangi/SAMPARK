const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//before saving, encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next(); //meaning don't render the code if the password is not modified
  }

  const salt = await bcrypt.genSalt(10); //the higher the number, the stronger salt will be generated
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userSchema);

module.exports = User;
