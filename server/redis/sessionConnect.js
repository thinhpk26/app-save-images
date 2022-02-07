require('dotenv').config()
const redis = require("redis");
const client = redis.createClient({legacyMode: true});
const session = require('express-session')
const RedisStore = require("connect-redis")(session)

;(async function() {
    await client.connect()
})()

module.exports = session({
    secret: process.env.SESSIONPASSWORD,
    store: new RedisStore({ host: 'localhost', port: 6379, client, ttl: 60*60*24 }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000*30*60,
    }
})

