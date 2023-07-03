const isConsumerConnector = async (req, res, next) => {
  if (req.user?.role === "consumerConnector") {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized access." });
  }
};

module.exports = { isConsumerConnector };
