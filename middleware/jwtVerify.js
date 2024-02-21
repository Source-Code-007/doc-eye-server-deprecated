const jwt = require('jsonwebtoken')
const jwtVerify = async (req, res, next) => {
    try {
        const { authorization } = req?.headers
        const jwtToken = authorization?.split(' ')[1]
        if (!jwtToken) {
            return res.status(401).send({ message: "Unauthorized user!" })
        }
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
        const { email } = decoded

        req.email = email
        next()
    } catch (e) {
        next({ message: `Authentication failure!` })
    }
}

module.exports = jwtVerify