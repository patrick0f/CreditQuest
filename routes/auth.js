const express = require("express");
const router = express.Router();

const {login, register, achievement, userAchievements} = require("../controllers/auth");

router.post("/register", register)
router.post("/login", login)
router.put("/achievement", achievement)
router.get("/achievements/:username", userAchievements)

module.exports = router;