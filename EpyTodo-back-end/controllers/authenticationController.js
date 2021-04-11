const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function jwtSignUser(user) {
    const SECRET_STRING = 'mysecretstring'
    const ONE_WEEK = 60 * 60 * 24 * 7

    return jwt.sign(
        {userId: user},
        SECRET_STRING,
        {expiresIn: ONE_WEEK})
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm ='0'+ mm;
    }
    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

module.exports = {
    login(req, res) {
        User.findOne({email : req.body.email})
            .then(user => {
                if(!user) {
                    return res.status(400).json({
                        msg: 'Invalid Credentials'
                    })
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(valid) {
                            return res.status(200).json({
                                token: jwtSignUser(user._id),
                            })
                        }
                        else {
                            return res.status(400).json({
                                msg: 'Invalid Credentials'
                            })
                        }
                    })
            })
            .catch(error => res.status(400).json({error}))
    },
    register(req, res) {
        bcrypt.hash(req.body.password, 10)
            .then(hashedPassword => {
                const user = new User({
                    email: req.body.email,
                    password: hashedPassword,
                    name: req.body.name,
                    firstname: req.body.firstname,
                    created_at: getCurrentDate()
                })
                user.save()
                    .then(user => {
                        return res.status(200).json({
                            token: jwtSignUser(user._id)
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(400).json({
                            msg: 'Account already exists'
                        })
                    })
            })
            .catch(() => res.status(500).json({msg: 'internal server error'}))
    },
}

        /* USE THIS TO DROP USER DATABASE
        User.remove({}, function(err) {
            console.log('collection removed')
        });*/