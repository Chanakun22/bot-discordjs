const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tiktok_noti = new Schema({
    id: String,
});

// ตรวจสอบว่าโมเดลมีอยู่แล้วหรือไม่
const noti = mongoose.models.notify_tiktok || mongoose.model('test-tiktok-notify', tiktok_noti);

// ส่งออกโมเดล
module.exports = noti;

