const {Schema, model} = require('mongoose')

let deleted_mes = new Schema({
    content: String,
    authorId:  String,
    channelId:  String,
    guildId:  String,
    createdAt:  String,
})

module.exports = model('deleted_mes123co',deleted_mes)