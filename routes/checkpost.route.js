const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const {
  createJoiningReq,
  getAllReqs,
  getAReq,
} = require("../controllers/checkpost.controller");

const router = express.Router();

router.post("/", isAuthenticated, createJoiningReq);
router.get("/", isAuthenticated, isAdmin, getAllReqs);
router.get("/:checkId", isAuthenticated, isAdmin, getAReq);

module.exports = router;
