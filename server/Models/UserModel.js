const {Schema, mongoose} = require('./connectDatabase')

const usersSchema = Schema({
    account: String,
    password: String,
    username: String,
    userID: String,
    retrieval: {
        numberphone: String,
        email: String,
    }, // lấy lại mật khẩu
    avatar: String, // url
    group: [{
        type: Schema.Types.ObjectId,
        ref: 'groups'
    }],
    pictureOfUser: [{
        link: String, //url
        picturename: String,
        pictureID: String,
        datetime: Object, // object: {hours: ..., day: ..., month: ..., year: ...}
        publicTo: [{
            type: Schema.Types.ObjectId,
            ref: 'groups'
        }],
    }],
    folder: [{
        foldername: String,
        folderID: String,
        images: [{
            imagesOfUser: [{
                link: String, //url
                picturename: String,
                pictureID: String,
                datetime: Object, // object: {hours: ..., day: ..., month: ..., year: ...}
                publicTo: [{
                    type: Schema.Types.ObjectId,
                    ref: 'groups'
                }],
            }],
            imagesOfGroup: [{
                type: Schema.Types.ObjectId,
                ref: 'picturesOfGroup'
            }]
        }]
    }],
    friend: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    online: Boolean,
    block: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }], // các friend bị chặn 
}, {
    connection: 'Users'
})

const UsersModel = mongoose.model('users', usersSchema)

module.exports = UsersModel

