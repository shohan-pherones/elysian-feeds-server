const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "providerConnector", "consumerConnector", "admin"],
      default: "user",
      required: true,
    },
    providers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
      },
    ],
    consumers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consumer",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    checkpost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checkpost",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.signup = async function (
  name,
  email,
  password,
  image,
  address,
  occupation,
  phoneNumber
) {
  //validate inputs
  if (
    !email ||
    !password ||
    !name ||
    !image ||
    !address ||
    !occupation ||
    !phoneNumber
  ) {
    throw new Error("all fields must be filled");
  }

  //validate email
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  //validate password
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain 8+ characters, lowercase, uppercase, numeric and symbol"
    );
  }

  //check if the user exists or not
  const isExist = await this.findOne({ email });

  if (isExist) {
    throw new Error("User already exists");
  }

  //password encryption
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //create user
  const user = await this.create({
    name,
    email,
    password: hash,
    image,
    address,
    occupation,
    phoneNumber,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  //validate inputs
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }

  //check if the user exists or not
  const user = await this.findOne({ email }).populate("checkpost").exec();

  if (!user) {
    throw new Error("Incorrect email");
  }

  //password decryption
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
