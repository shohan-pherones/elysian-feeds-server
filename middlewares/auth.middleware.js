const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Invalid token format.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("No token provided.");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ _id: id });

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token." });
    } else {
      res.status(403).json({ error: "Unauthorized access." });
    }
  }
};

module.exports = { isAuthenticated };
