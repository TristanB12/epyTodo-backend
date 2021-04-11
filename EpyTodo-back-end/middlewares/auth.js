const jwt = require('jsonwebtoken');

module.exports = {
    authenticateToken(req, res, next) {
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
            req.user = user
            next()
        })
    }
}