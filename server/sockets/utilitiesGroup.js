const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const {v4} = require('uuid')
const UserModel = require('../Models/UserModel')
const {GroupModel} = require('../Models/GroupModel')
const {findModel, saveRedis, getRedis} = require('../redis/connectRedis')

module.exports = async function(socket, io) {
    try {
        socket.on('stick msg', async({groupIDToken, IDMsgToken, msg}) => {
            const _idGroup = jwt.verify(groupIDToken, process.env.JWTPASSWORD)
            GroupModel.updateOne({_id: _idGroup}, {stickMsg: {$push: {
                IDMsgToken: IDMsgToken,
                user: socket._id,
                msg,
            }}}).exec(() => {
                io.to(socket.id).emit('stick success')
            })
            socket.to(_idGroup).emit('stick msg', {userSticky: socket._idToken, groupIDToken, IDMsgToken, msg})
        })
    } catch (err) {
        io.to(socket.id).emit('error server', err)
    }
}
