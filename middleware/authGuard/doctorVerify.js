const User = require("../../api/models/Users")

const doctorVerify = async (req, res, next) => {
    try {
        const { userId } = req
        console.log(userId, 'from doctor verify');
        const isDoctor = await User.findOne({ $and: [{ role: 'doctor' }, { _id: userId }] })

        if (isDoctor) {
            next()
        } else {
            next(`Doctor verify failure!`)
        }
    } catch (e) {
        next(`Doctor verify failure!`)
    }
}

module.exports = doctorVerify