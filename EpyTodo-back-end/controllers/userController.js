const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = {
    getUserFromJWT(req, res) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.status(401).json({
            msg: "internal server error"
        })
        jwt.verify(token, "mysecretstring", (err, user) => {
            if (err)
                return res.status(403).json({
                    msg: "Token is not valid"
            })
            User.findOne({_id: user.userId})
                .then(user => {
                    res.status(200).json({
                        ...user._doc
                    })
                }).catch(() => res.status(403).json({
                    msg: "cannot find the user"
                }))
        })
    }
}