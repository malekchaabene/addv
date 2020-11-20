const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/authconfig');
const { Op } = require('sequelize')

//Import Models
const db = require('../config/dbconfig');
const User = db.user;
const Token = db.token;

module.exports = {



    ////////////////////////////////
    ////////// Login User
    ////////////////////////////////
    async signIn(req, res) {
        console.log("Enter : " + req.body.email)
        let { email, password } = req.body;
        User.findOne({
            where: {
                email: email
            },
        }).then(async user => {
            if (!user) {
                res.status(404).json({ msg: "User Not Found" });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    let token = jwt.sign({ user: user }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });
                    token = await Token.create({ token: token })
                    await user.setToken(token);
                    res.json({
                        user: user,
                        token: token
                    })
                } else {
                    res.status(401).json({ msg: "Password Incorrect" })
                }

            }

        }).catch(err => {
            res.status(500).json(err);
        })

    },



    ////////////////////////////////
    ////////// Register User 
    ////////////////////////////////
    async signUp(req, res) {

        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));

        const usercheck = await User.findOne({
            where: {
                email: { [Op.like]: "%" + req.body.email.toLowerCase() + "%" },
            }
        })
        if (!usercheck) {
            User.create({
                fname: req.body.fname,
                email: req.body.email.toLowerCase(),
                lname: req.body.lname,
                password: password
            }).then(async user => {

                let token = jwt.sign({ user: user }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });
                token = await Token.create({ token: token })
                await user.setToken(token);
                res.status(201).json({
                    user: user,
                    token: token
                });

            }).catch(err => {
                res.status(500).json(err);
            });
        }else{
            res.status(404).json({"msg": "User Already Exist"});
        }


    }
}