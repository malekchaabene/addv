const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const { Op } = require('sequelize')
//Import Models
const db = require('../config/dbconfig');
const User = db.user;
const Token = db.token;


const auth = async (req, res, next) => {
    console.log(' ----> Auth Middleware Security RUN TEST')
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        
        //////////// Key Of The Cryptation :
        const decoded = jwt.verify(token, 'x199103')
        
        const user = await User.findAll({
            where: {
                id: decoded.user.id,
                '$token.token$' : token,
            },
            include: [
                {
                    model: Token,
                    as: 'token',
                    require: false
                },
            ]
        })
        if (!user) {
            throw new Error()
        }

        ///////////////////////////
        ////////////////////
        /////   Uni-Connection Part 
        ////////////////////
        ///////////////////////////

        req.token = token[0]
        req.user = user[0]
        next()

    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }

}

module.exports = auth