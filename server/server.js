"use strict";
const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cookie = require('cookie')


// server
const app = express()
const http = require('http')
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
const {redisClient} = require('./redis/connectRedis')


;(async function() {
    await redisClient.connect()
    // middleware
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())













    // socket
    const io = require('./sockets/allSocket').listen(server)



    server.listen(PORT, () => {
        console.log('listened at http://localhost:' + PORT)
    })
})()
