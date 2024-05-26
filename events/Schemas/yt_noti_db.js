const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
    channelTitle: String,
    videoId: String,
    title: String,
    publishedAt: Date
});

// ใช้ 'model' ที่ถูกนำเข้ามาเพื่อสร้างและส่งออกโมเดล
module.exports = model('Video', videoSchema);
