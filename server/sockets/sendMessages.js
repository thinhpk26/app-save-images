const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const {v4} = require('uuid')
const UserModel = require('../Models/UserModel')
const {GroupModel} = require('../Models/GroupModel')
const {findModel, saveRedis, getRedis} = require('../redis/connectRedis')

// gửi token của userID
module.exports = async function(socket, io) {
    try {
        socket.on('send messages to a group', async ({group, to, reply, msg}) => {
            const IDToken = cookie.parse(socket.handshake.headers.cookie).IDToken
            if(IDToken === socket._idToken) {
                if(group) const _idGroup = jwt.verify(group, process.env.JWTPASSWORD)
                else io.to(socket.id).emit('error account')
                // nếu 'to' là @mọi người thì ký hiệu 1 còn nếu là @user thì sẽ là 1 mảng gồm các _idUser
                // nếu là trả lời tin nhắn trong nhóm thì thêm trường 'reply'
                const msgID = v4()
                const IDmsgToken = jwt.sign(msgID, process.env.JWTPASSWORD)
                if(to) {
                    if(to.length > 0) {
                        const _idUsersAreSended = []
                        for(const _idUserIsSended of to)
                            _idUsersAreSended.push(jwt.verify(_idUserIsSended, process.env.JWTPASSWORD))
                        if(reply) {
                            const _idReply = jwt.verify(reply, process.env.JWTPASSWORD)
                            GroupModel.updateOne({_id: _idGroup}, {$push: {msg: {
                                msgID: msgID,
                                from: socket._id,
                                reply: _idReply,
                                to,
                                msg,
                            }}}).exec(() => {
                                // trạng thái đã được lưu và chờ các user khác nhận msg
                                io.to(socket.id).emit('receive messages from own: sended')
                            })
                            socket.to(_idGroup).emit('receive messages from other', {from: socket.userIDToken, to, reply, IDmsgToken, msg})
                        } else {
                            GroupModel.updateOne({_id: _idGroup}, {$push: {msg: {
                                msgID: msgID,
                                from: socket._id,
                                to,
                                msg,
                            }}}).exec(() => {
                                // trạng thái đã được lưu và chờ các user khác nhận msg
                                io.to(socket.id).emit('receive messages from own: sended')
                            })
                            socket.to(_idGroup).emit('receive messages from other', {from: socket.userIDToken, to, IDmsgToken, msg})
                        }
                    } else {
                        if(reply) {
                            const _idReply = jwt.verify(reply, process.env.JWTPASSWORD)
                            GroupModel.updateOne({_id: _idGroup}, {$push: {msg: {
                                msgID: msgID,
                                from: socket._id,
                                reply: _idReply,
                                to: [1],
                                msg,
                            }}}).exec(() => {
                                // trạng thái đã được lưu và chờ các user khác nhận msg
                                io.to(socket.id).emit('receive messages from own: someone is sended', {isSended: true})
                            })
                            socket.to(_idGroup).emit('receive messages from other', {from: socket.userIDToken, to: 1, reply, IDmsgToken, msg})
                        } else {
                            GroupModel.updateOne({_id: _idGroup}, {$push: {msg: {
                                msgID: msgID,
                                from: socket._id,
                                to: [1],
                                msg,
                            }}}).exec(() => {
                                // trạng thái đã được lưu và chờ các user khác nhận msg
                                io.to(socket.id).emit('receive messages from own: someone is sended', {isSended: true})
                            })
                            socket.to(_idGroup).emit('receive messages from other', {from: socket.userIDToken, to: 1, IDmsgToken, msg})
                        }
                    }
                } else {
                    if(reply) {
                        const _idReply = jwt.verify(reply, process.env.JWTPASSWORD)
                        GroupModel.updateOne({_id: _idGroup}, {$push: {msg: {
                            msgID: msgID,
                            from: socket._id,
                            reply: _idReply,
                            msg,
                        }}}).exec(() => {
                            // trạng thái đã được lưu và chờ các user khác nhận msg
                            io.to(socket.id).emit('receive messages from own: someone is sended', {isSended: true})
                        })
                        socket.to(_idGroup).emit('receive messages from other', {from: socket.userIDToken, reply, IDmsgToken, msg})
                    } else {
                        GroupModel.updateOne({_id: _idGroup}, {$push: {msg: {
                            msgID: msgID,
                            from: socket._id,
                            msg,
                        }}}).exec(() => {
                            // trạng thái đã được lưu và chờ các user khác nhận msg
                            io.to(socket.id).emit('receive messages from own: someone is sended', {isSended: true})
                        })
                        socket.to(_idGroup).emit('receive messages from other', {from: socket.userIDToken, reply, IDmsgToken, msg})
                    }
                }
            } else io.to(socket.id).emit('error account')
        })

        // sự kiện đang nhập hoặc kết thúc nhập
        socket.on('entering msg state', ({from, group}) => {
            const _idGroup = jwt.verify(group, process.env.JWTPASSWORD)
            socket.to(_idGroup).emit('someone is entering msg', {from, group}) 
        })
        socket.on('finish entering msg state', ({from, group}) => {
            const _idGroup = jwt.verify(group, process.env.JWTPASSWORD)
            socket.to(_idGroup).emit('someone finish entering msg', {from, group}) 
        })

    } catch (err) {
        io.to(socket.id).emit('error server', err)
    }
}