const {Schema, mongoose} = require('./connectDatabase')

const usersSchema = Schema({
    account: String, // tên tài khoản
    password: String,
    username: String,
    userID: String,
    retrieval: {
        numberphone: String,
        email: String,
    }, // lấy lại mật khẩu
    avatar: String, // url
    link: String,
    group: [{
        type: Schema.Types.ObjectId,
        ref: 'groups'
    }],
    pictureOfUser: [{
        pictureID: String,
        link: String, //url
        picturename: String,
        pictureID: String,
        datetime: {
            type: Date,
            default: Date.now(),
        },
        publicTo: [{
            type: Schema.Types.ObjectId,
            ref: 'groups'
        }],
    }],
    folder: [{
        folderID: String,
        foldername: String,
        folderID: String,
        images: [{
            imagesOfUser: [{
                pictureID: String,
                link: String, //url
                picturename: String,
                pictureID: String,
                datetime: {
                    type: Date,
                    default: Date.now(),
                },
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
    online: Number, // 0 là chặn không cho biết, 1 là online, -1 là offline
    block: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }], // các friend bị chặn 
}, {
    connection: 'Users'
})

const UsersModel = mongoose.model('users', usersSchema)

module.exports = UsersModel

