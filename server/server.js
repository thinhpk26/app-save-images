"use strict";
const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cookie = require('cookie')

// kết nối session
const sessionMiddleware = require('./redis/sessionConnect')

// server
const app = express()
const http = require('http')
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
const {redisClient} = require('./redis/connectRedis')
const loginRouter = require('./something_own_to_test/login');
const path = require('path');
const UsersModel = require('./Models/UserModel');
const jwt = require('jsonwebtoken');


(async function() {
    await redisClient.connect()
    // middleware
    // cookie
    app.use(cookieParser())
    // body
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use('/something_own_to_test', express.static(path.join(__dirname, './something_own_to_test')))
    app.use('/login', loginRouter)

    // session store
    app.use(sessionMiddleware);
    app.get('/', async (req, res, next) => {
        if(!req.session.informationUser) {
            const IDToken = req.cookies.IDToken
            let _id
            if(IDToken) _id = jwt.verify(IDToken, process.env.JWTPASSWORD)._id
            else res.send('lỗi tài khoản')
            const user = await UsersModel.findOne({_id}, 'username userID avatar link').lean()
            if(user) {
                req.session.informationUser = user
                next()
            } else res.send('lỗi tài khoản')
        } else {
            next()
        }
    }, (req, res) => {
        res.render(path.join(__dirname, '/something_own_to_test/view/index.ejs'))
    })











    // socket
    const io = require('./sockets/allSocket').listen(server)



    server.listen(PORT, () => {
        console.log('listened at http://localhost:' + PORT)
    })
})()
