const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true},
    gender: { type: String, required: true, enum:['male', 'female', 'other']},
    avatar: { type: String, required: true, default: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp' },
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