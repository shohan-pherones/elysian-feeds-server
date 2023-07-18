const mongoose = require("mongoose");
const Provider = require("../models/provider.model");
const Contribution = require("../models/contribution.model");
const User = require("../models/user.model");

const createProvider = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, image, address } = req.body;

    const provider = await Provider.create({ name, image, address, user: _id });

    await User.findByIdAndUpdate(_id, {
      $push: {
        providers: provider._id,
      },
    });

    res.status(200).json(provider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProviders = async (req, res) => {
  try {
    const { _id } = req.user;

    const providers = await Provider.find({ user: _id })
      .sort({ createdAt: -1 })
      .populate("contributions")
      .exec();

    res.status(200).json(providers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAProvider = async (req, res) => {
  try {
    const { pid } = req.params;
    const { _id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw new Error("Provider not found.");
    }

    const provider = await Provider.findOne({ _id: pid })
      .populate("contributions")
      .exec();

    if (!provider) {
      throw new Error("Provider not found.");
    }

    if (provider.user.toString() !== _id.toString()) {
      throw new Error("Unauthorized access.");
    }

    res.status(200).json(provider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createContribution = async (req, res) => {
  try {
    const { pid } = req.params;
    const { _id } = req.user;
    const { name, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw new Error("Provider not found.");
    }

    const provider = await Provider.findOne({ _id: pid });

    if (!provider) {
      throw new Error("Provider not found.");
    }

    if (provider.user.toString() !== _id.toString()) {
      throw new Error("Unauthorized access.");
    }

    const contribution = await Contribution.create({
      provider: pid,
      name,
      amount,
    });

    await Provider.findByIdAndUpdate(pid, {
      $push: {
        contributions: contribution._id,
      },
    });

    res.status(200).json(contribution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPublicProviders = async (req, res) => {
  try {
    const providers = await Provider.find({})
      .sort({ createdAt: -1 })
      .populate("contributions")
      .populate("user")
      .exec();

    res.status(200).json(providers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAPublicProvider = async (req, res) => {
  try {
    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw new Error("Provider not found.");
    }

    const provider = await Provider.findById(pid)
      .populate("contributions")
      .populate("user")
      .exec();

    res.status(200).json(provider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProvider,
  getAllProviders,
  getAProvider,
  createContribution,
  getPublicProviders,
  getAPublicProvider,
};
