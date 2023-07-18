const mongoose = require("mongoose");
const Consumer = require("../models/consumer.model");
const Consumption = require("../models/consumption.model");
const User = require("../models/user.model");

const createConsumer = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, image, address } = req.body;

    const consumer = await Consumer.create({
      name,
      image,
      address,
      user: _id,
    });

    await User.findByIdAndUpdate(_id, {
      $push: {
        consumers: consumer._id,
      },
    });

    res.status(200).json(consumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllConsumers = async (req, res) => {
  try {
    const { _id } = req.user;

    const consumers = await Consumer.find({ user: _id })
      .populate("consumptions")
      .exec();

    res.status(200).json(consumers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAConsumer = async (req, res) => {
  try {
    const { cid } = req.params;
    const { _id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("Consumer not found.");
    }

    const consumer = await Consumer.findOne({ _id: cid });

    if (!consumer) {
      throw new Error("Consumer not found.");
    }

    if (consumer.user.toString() !== _id.toString()) {
      throw new Error("Unauthorized access.");
    }

    res.status(200).json(consumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createConsumption = async (req, res) => {
  try {
    const { cid } = req.params;
    const { _id } = req.user;
    const { name, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("Consumer not found.");
    }

    const consumer = await Consumer.findOne({ _id: cid });

    if (!consumer) {
      throw new Error("Consumer not found.");
    }

    if (consumer.user.toString() !== _id.toString()) {
      throw new Error("Unauthorized access.");
    }

    const comsumption = await Consumption.create({
      consumer: cid,
      name,
      amount,
    });

    await Consumer.findByIdAndUpdate(cid, {
      $push: {
        consumptions: comsumption._id,
      },
    });

    res.status(200).json(comsumption);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPublicConsumers = async (req, res) => {
  try {
    const consumers = await Consumer.find({})
      .sort({ createdAt: -1 })
      .populate("consumptions")
      .populate("user")
      .exec();

    res.status(200).json(consumers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAPublicConsumer = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("Consumer not found.");
    }

    const consumer = await Consumer.findById(cid)
      .populate("consumptions")
      .populate("user")
      .exec();

    res.status(200).json(consumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createConsumer,
  getAllConsumers,
  getAConsumer,
  createConsumption,
  getPublicConsumers,
  getAPublicConsumer,
};
