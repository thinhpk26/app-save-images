const {Server} = require('socket.io')

module.exports.listen = function(server) {
    const io = new Server(server)

    io.on('connection', async () => {
        console.log('1 user connect socket')
    })
}

