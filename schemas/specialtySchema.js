const mongoose = require('mongoose')


const specialtySchema = mongoose.Schema({
    specialtyName: String,
    specialtyDescription: String,
    specialtyLogo: {
        type: String,
        validate: {
            validator: function(value) {
                // Perform validation to check if value is a URL to an image
                // Example: Check if the URL ends with common image file extensions like .jpg, .png, .gif, etc.
                return /\.(jpg|jpeg|png|gif)$/i.test(value);
            },
            message: props => `${props.value} is not a valid image URL`
        }
    }
})

module.exports = specialtySchema