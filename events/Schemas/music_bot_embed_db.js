const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const music_bot_db = new Schema({
    guildId: { type: String, required: true },
    embedMessageId: { type: String, required: true }
});

// ตรวจสอบว่าโมเดลมีอยู่แล้วหรือไม่
const noti = mongoose.models.music_bot_db || mongoose.model('music_bot_db', music_bot_db);

// ส่งออกโมเดล
module.exports = noti;

