const {Server} = require('socket.io')
const {findModel, saveRedis, getMongodb} = require('../redis/connectRedis')
const sessionMiddleware = require('../redis/sessionConnect')
const UsersModel = require('../Models/UserModel')
const cookie = require('cookie')
require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports.listen = function(server) {
    const io = new Server(server)
    io.use(async (socket, next) => {
        sessionMiddleware(socket.request, socket.request.res || {}, next)
    })
    io.use(async (socket, next) => {
        try {
            const IDToken = cookie.parse(socket.handshake.headers.cookie).IDToken
            const _id = jwt.verify(IDToken, process.env.JWTPASSWORD)._id
            // user trả về mảng
            let haveUser = true
            const informationUser = socket.request.session.informationUser
            let {username, userID, avatar, link} = informationUser
            if(!informationUser) {
                const user = await UsersModel.findOne({_id}, 'username userID avatar link').lean()
                if(user) {
                    username = user.username
                    userID = user.userID
                    avatar = user.avatar
                    link = user.link
                } else haveUser = false
                socket.request.session.informationUser = user
            }
            if(haveUser) {
                const userIDToken = jwt.sign(userID, process.env.JWTPASSWORD)
                socket._id = _id
                socket._idToken = IDToken
                socket.userID = userID
                socket.userIDToken = userIDToken
                socket.username = username
                socket.avatar = avatar
                socket.link = link
                next()
                saveRedis(`socketCurrentID: _id(${_id})`, `save momentarily`, JSON.stringify({socketCurrentID: socket.id}))
            }
        } catch (err) {
            socket.to(socket._id).emit('error server', err)
        }
    })  

    io.on('connection', async (socket) => {
        console.log('1 user connect socket')
        userConnect(socket)
    })
}

