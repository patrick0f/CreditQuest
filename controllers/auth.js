const User = require("../models/User");
const {StatusCodes}= require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors/index");

const register = async(req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: {username: user.getName()}, token});
}

const login = async(req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        throw new BadRequestError("provide email and pwd");
    }
    const user = await User.findOne({username})
    if (!user) {
        throw new UnauthenticatedError("invalid credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("invalid credentials");
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{username:user.getName()}, token})
}




module.exports = {
    register,
    login
}