const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true},
    gender: { type: String, required: true, enum:['male', 'female', 'other']},
    avatar: { type: String, required: true, default: function(){
        if(this.gender === 'male'){
            return 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp'
        } else if(this.gender === 'female'){
            return 'https://w7.pngwing.com/pngs/284/973/png-transparent-china-girl-cartoon-free-s-of-girl-on-girl-child-face-black-hair.png'
        } else if(this.gender === 'other'){
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzY9VLmrZN4lZahZ_IjBwKFRhsoCEOytfWvg&usqp=CAU'
        }
    } },
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