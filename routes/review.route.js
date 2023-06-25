const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const {
  getAllReviews,
  createReview,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/", getAllReviews);
router.post("/", isAuthenticated, createReview);

module.exports = router;
