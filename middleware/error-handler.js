const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "something went wrong"
    }

    if (err.name === "ValidationError") {
            customError.msg = Object.values(err.errors).map(err => err.message).join(', ')
            customError.statusCode = 400
        }
    if (err.code && err.code ===11000) {
        customError.msg = "duplicate value entered, please enter another value"
        customError.statusCode = 400
    }
    if (err.name === 'CastError') {
        customError.msg = 'no item found with this id'
        customError.statusCode = 404
    }
    
    return res.status(customError.statusCode).json({ msg: customError.msg })
  }
  
  module.exports = errorHandlerMiddleware