const mongoose = require("mongoose");
const Checkpost = require("../models/checkpost.model");
const User = require("../models/user.model");

const createJoiningReq = async (req, res) => {
  try {
    const { _id } = req.user;
    const { choice } = req.body;

    const checkpost = await Checkpost.create({
      choice,
      user: _id,
    });

    await User.findByIdAndUpdate(_id, { $set: { checkpost: checkpost._id } });

    res.status(200).json(checkpost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllReqs = async (req, res) => {
  try {
    const reqs = await Checkpost.find({})
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    if (!reqs) {
      throw new Error("No request found.");
    }

    res.status(200).json(reqs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAReq = async (req, res) => {
  try {
    const { checkId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checkId)) {
      throw new Error("Request not found.");
    }

    const request = await Checkpost.findOne({ _id: checkId })
      .populate("user")
      .exec();

    if (!request) {
      throw new Error("No request found.");
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createJoiningReq,
  getAllReqs,
  getAReq,
};
