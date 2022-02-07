const cookie = require('cookie')
const {findModel, saveRedis, getRedis} = require('../redis/connectRedis')

module.exports = async function(socket) {
    try {

    } catch (err) {
        socket.to(socket.id).emit('error server', err)
    }
}