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

const achievement = async(req, res) => {
    try {
        const { username, achievementName } = req.body;
        
        const result = await User.findOneAndUpdate(
          { username: username, "achievements.name": achievementName },
          { 
            $set: { 
              "achievements.$.unlocked": true,
              "achievements.$.unlockedAt": new Date()
            } 
          },
          { new: true } // Return the updated document
        );
        if (!result) {
            return res.status(404).json({ msg: 'User or achievement not found' });
          }
          
          res.json({ success: true, achievements: result.achievements });
        } catch (error) {
          console.error(error);
          res.status(500).json({ msg: 'Server error' });
        }
    }

    const userAchievements = async(req, res) => {
        try {
            const { username } = req.params;
            
            if (!username) {
              return res.status(400).json({ msg: 'Please provide a username' });
            }
            
            // Find the user and select only the achievements field
            const user = await User.findOne({ username }).select('achievements');
            
            if (!user) {
              return res.status(404).json({ msg: 'User not found' });
            }
            
            res.status(200).json(user.achievements);
          } catch (error) {
            console.error('Get achievements error:', error);
            res.status(500).json({ msg: 'Server error' });
          }
    }


module.exports = {
    register,
    login,
    achievement,
    userAchievements
}