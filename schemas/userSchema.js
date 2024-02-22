const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        required: [true,'Email required'],
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: "Please enter a valid email"
        }
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'doctor', 'admin'] }
})


module.exports = userSchema