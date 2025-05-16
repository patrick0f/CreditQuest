const express = require("express");
const router = express.Router();

const {chat, creditLife} = require("../controllers/api");

router.post("/chat", chat)
router.post("/creditLife", creditLife)

module.exports = router;