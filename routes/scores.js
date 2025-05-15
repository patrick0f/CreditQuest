const express = require("express");
const router = express.Router();

const {
    getTopScores,
    createScore } = require("../controllers/scores");

router.route('/').get(getTopScores).post(createScore);

module.exports = router;