const mongoose = require('mongoose')


const specialtySchema = mongoose.Schema({
    specialtyName: {type:String, required: true},
    specialtyDescription: {type:String, required: true},
    specialtyLogo: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Perform validation to check if value is a URL to an image
                // Example: Check if the URL ends with common image file extensions like .jpg, .png, .gif, etc.
                // TODO: Update validation
                return /\.(jpg|jpeg|png|gif)$/i.test(value);
            },
            message: props => `${props.value} is not a valid image URL`
        }
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = specialtySchema