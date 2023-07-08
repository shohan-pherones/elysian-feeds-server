const mongoose = require("mongoose");
const { createToken } = require("../helpers/token.helper");
const User = require("../models/user.model");
const Checkpost = require("../models/checkpost.model");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, image, address, occupation, phoneNumber } =
      req.body;
    const user = await User.signup(
      name,
      email,
      password,
      image,
      address,
      occupation,
      phoneNumber
    );

    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAnUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { _id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      throw new Error("User not found.");
    }

    if (uid !== _id.toString()) {
      throw new Error("Unauthorized access.");
    }

    const user = await User.findById(uid).populate("checkpost").exec();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const { role, checkId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      throw new Error("User not found.");
    }

    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { $set: { role } },
      { new: true }
    );

    const updatedCheckpost = await Checkpost.findByIdAndUpdate(
      checkId,
      { $set: { status } },
      { new: true }
    );

    res.status(200).json({ updatedUser, updatedCheckpost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getAllUsers,
  getAnUser,
  updateUserRole,
};
