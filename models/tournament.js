const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
      max: 32,
    },
    type: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    platform: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    participants: {
      type: Number,
      default: 0,
    },
    maxParticipants: {
      type: Number,
      default: 0,
    },
    banner: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamp: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    // create a temporarity variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encryptPassword
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userSchema);
