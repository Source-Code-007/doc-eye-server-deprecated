const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    avatar: String,
    email: {
        type: String,
        lowercase: true,
        required: [true,'Email required'],
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: "Please enter a valid email"
        }
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'doctor', 'admin'], default: 'user'},
}, {timestamps: true})


const User = new mongoose.model("User", userSchema)
module.exports = User