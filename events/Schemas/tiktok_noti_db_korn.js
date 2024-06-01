const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tiktok_noti_korn = new Schema({
    id: String,
});

// ตรวจสอบว่าโมเดลมีอยู่แล้วหรือไม่
const noti = mongoose.models.notify_tiktok_korn || mongoose.model('notify_tiktok_korn', tiktok_noti_korn);

// ส่งออกโมเดล
module.exports = noti;

