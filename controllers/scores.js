const Score = require("../models/Score");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors/index");
const asyncWrapper = require('../middleware/async')

const getTopScores = asyncWrapper( async (req, res, next) => {
    const scores = await Score.find({})
    // if (scores.length === 0) {
    //     return next(createCustomError("no scores found", 404))
    // }
    res.status(StatusCodes.OK).json(scores)
})

const getUserScores = asyncWrapper( async (req, res,) => {
    const scores = await Score.find({createdBy: req.user.userId}).sort('createdAt')
    // if (scores.length === 0) {
    //     return next(createCustomError("no scores found", 404))
    // }
    res.status(StatusCodes.OK).json(scores)
})  

const createScore = asyncWrapper(async (req, res) => {
    req.body.createdBy = req.user.userId;
    const score = await Score.create(req.body)
    res.status(StatusCodes.CREATED).json(score)
  })

module.exports = {
    getTopScores,
    createScore,
    getUserScores
}