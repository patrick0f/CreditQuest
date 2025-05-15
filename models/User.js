const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please provide username'],
        minLength: 5,
        maxLength: 30
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minLength: 8
    }
})

// hashes password before user is created
UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// get method
UserSchema.methods.getName = function() {
    return this.username;
}

// generate new jwt token
UserSchema.methods.createJWT = function() {
     return jwt.sign({userId: this._id, username: this.username}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

// compares the login attempt password with the hashed password that is stored in the user schema
UserSchema.methods.comparePassword = async function(pwd) {
    const isMatch = await bcrypt.compare(pwd, this.password)
    return isMatch
}
module.exports = mongoose.model("User", UserSchema)