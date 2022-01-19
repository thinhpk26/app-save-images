const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/app_img_database')
const Schema = mongoose.Schema

module.exports = {Schema, mongoose}