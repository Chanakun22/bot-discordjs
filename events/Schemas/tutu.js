const { Schema, model } = require('mongoose');

const tutui = new Schema({
    channelTitle: String,
    videoId: String,
    title: String,
    publishedAt: Date
});

// ใช้ 'model' ที่ถูกนำเข้ามาเพื่อสร้างและส่งออกโมเดล
module.exports = model('tutui123', tutui);
