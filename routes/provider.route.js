const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isProviderConnector } = require("../middlewares/provider.middleware");
const {
  createProvider,
  getAllProviders,
  getAProvider,
  createContribution,
  getPublicProviders,
} = require("../controllers/provider.controller");

const router = express.Router();

router.get("/all", getPublicProviders);
router.post("/", isAuthenticated, isProviderConnector, createProvider);
router.get("/", isAuthenticated, isProviderConnector, getAllProviders);
router.get("/:pid", isAuthenticated, isProviderConnector, getAProvider);
router.post("/:pid", isAuthenticated, isProviderConnector, createContribution);

module.exports = router;
