const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const pepper = process.env.PEPPER_SECRET;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;


  try {
    // hash password using becrypt with salt and pepper

    // generate salt
    const salt = await bcrypt.genSalt(10);

    // add pepper to password
    const passwordWithPepper = user.password + pepper;

    // hash password with salt and pepper
    const hash = await bcrypt.hash(passwordWithPepper, salt);

    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const loggedPassword = candidatePassword + pepper;
    return await bcrypt.compare(loggedPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = model("User", UserSchema);

module.exports = {
  User,
};
