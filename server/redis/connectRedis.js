const redisClient = require('redis').createClient(6379, 'localhost')

// chỉ sử dụng với truy vấn bậc cao nhất và không thể save vào mongodb
async function findModel(Model, condition, populate, {hashKey, key}) {
    if(condition && populate) {
        const userRedis = await getRedis(hashKey, key)
        if(userRedis) return userRedis
        else {
            console.log('get from mongodb')
            const userMongodb = await getMongodb(Model, condition, populate)
            if(userMongodb && userMongodb.length > 0) {
                saveRedis(hashKey, key, JSON.parse(JSON.stringify(userMongodb)))
            } else return undefined
        }
    } else return undefined
}

async function getMongodb(Model, condition, populate) {
    // lấy select cấp cao nhất
    let selectHightestLevel
    // path đường dẫn cấp thấp hơn và select trường bên trong
    let pathAndSelect = []
    populate.forEach(item => {
        if(typeof item === 'string') selectHightestLevel = item
        else if(typeof item === 'object') {
            pathAndSelect.push(item)
        }
    })
    let dataMongodb
    if(selectHightestLevel) dataMongodb = await Model.find(condition).select(selectHightestLevel).populate(pathAndSelect)
    else dataMongodb = await Model.find(_id).populate(pathAndSelect)
    if(dataMongodb.length === 0) return undefined
    else return dataMongodb
}

async function saveRedis(hashKey, key, value) {
    redisClient.hSet(hashKey, key, JSON.stringify(value))
    redisClient.expire(hashKey, 60*30)
}

async function getRedis(hashKey, key) {
    if(hashKey && key) {
        let redisData = await redisClient.HGET(hashKey, key) // key là string
        redisData = JSON.parse(redisData)
        if(redisData instanceof Array) {
            redisClient.expire(hashKey, 60*30)
            return redisData
        } else if(redisData instanceof Object) {
            redisClient.expire(hashKey, 60*30)
            const result = []
            return result.push(redisData)
        } else return undefined
    } return undefined
}

async function clearRedis(hashKey) {
    redisClient.del(JSON.stringify(hashKey))
}

module.exports = {redisClient, findModel, getRedis, saveRedis, getMongodb, clearRedis}
