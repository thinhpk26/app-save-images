const express = require('express')
const loginRouter = express.Router()
const UsersModel = require('../Models/UserModel')
const jwt = require('jsonwebtoken')
const path = require('path')

loginRouter.get('/', (req, res, next) => {
    res.render(path.join(__dirname, '/view/login.ejs'))
})

loginRouter.post('/checklogin', async(req, res, next) => {
    const {account, password} = req.body
    const userSatisfy = await UsersModel.findOne({account, password})
    if(userSatisfy) {
        const IDToken = jwt.sign({_id: userSatisfy._id}, process.env.JWTPASSWORD)
        res.send(IDToken)
    } else {
        res.json(false)
    }
})

module.exports = loginRouter