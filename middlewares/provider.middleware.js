const isProviderConnector = async (req, res, next) => {
  if (req.user?.role === "providerConnector") {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized access." });
  }
};

module.exports = { isProviderConnector };
