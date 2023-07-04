const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isConsumerConnector } = require("../middlewares/consumer.middleware");
const {
  createConsumer,
  getAllConsumers,
  getAConsumer,
  createConsumption,
} = require("../controllers/consumer.controller");

const router = express.Router();

router.post("/", isAuthenticated, isConsumerConnector, createConsumer);
router.get("/", isAuthenticated, isConsumerConnector, getAllConsumers);
router.get("/:cid", isAuthenticated, isConsumerConnector, getAConsumer);
router.post("/:cid", isAuthenticated, isConsumerConnector, createConsumption);

module.exports = router;
