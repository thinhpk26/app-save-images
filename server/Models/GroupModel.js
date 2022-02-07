const {Schema, mongoose} = require('./connectDatabase')

const groupsSchema = Schema({
    groupID: String,
    groupname: String,
    host: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    members: [{
        nickname: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    stickMsg: [{
        stickMsgID: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        msg: String,
    }],
    msg: [{
        msgID: String,
        from: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        to: [{
            type: Schema.Types.ObjectId,
            ref: 'users',
        }],
        reply: String,
        datetime: {
            type: Date,
            default: Date.now(),
        },
        msg: String,
    }],
    folder: [{  // các tệp ảnh
        foldername: String,
        datetimeCreate: Object,
        picture: {
            type: Schema.Types.ObjectId,
            ref: 'picturesOfGroup'
        }
    }],
    picturesOfGroup: [{
        type: Schema.Types.ObjectId,
        ref: 'picturesOfGroup',
    }]
}, {
    connection: 'Groups'
})

const picturesOfGroupSchema = Schema({
    link: String, // url
    pictureID: String,
    group: {
        type: Schema.Types.ObjectId,
        ref: 'groups'
    },
    datetime: {
        type: Date,
        default: Date.now(),
    },
    comments: [{
        commentID: String,
        mode: Boolean, // chế độ true ẩn danh , false là public
        datetime: {
            type: Date,
            default: Date.now(),
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        content: String,
        reaction: [{
            reaction: String,
            mode: Boolean,
            from: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }],
    }],
    from: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    reaction: [{
        reaction: String,
        mode: Boolean,
        from: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }]
}, {
    connection: 'PicturesOfGroup'
})

const GroupModel = mongoose.model('groups', groupsSchema)
const PictureOfGroupModel = mongoose.model('picturesOfGroup', picturesOfGroupSchema)

PictureOfGroupModel.updateMany({}, {datetime: Date.now()}).then().catch()


module.exports = {GroupModel, PictureOfGroupModel}


