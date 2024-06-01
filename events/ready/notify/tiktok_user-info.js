// const Signer = require("tiktok-signature");
// const axios = require("axios"); // หมายเหตุ: ไม่ได้เพิ่มโมดูลนี้ไว้ใน package.json คุณต้องติดตั้งด้วยตัวเอง
// const querystring = require('querystring');
// const { EmbedBuilder } = require('discord.js');


// module.exports = async (client) => {


//     // ชื่อผู้ใช้ TikTok ของคุณ
//     const USER_UNIQUE_ID = "artur7932";

//     // เราใช้ Apple ตามคอมเมนต์ในรีโพจากผู้พัฒนา ซึ่งช่วยป้องกันไม่ให้ TikTok ตรวจจับด้วย Captcha
//     const USER_AGENT =
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.53";

//     // นี่คือ URL สุดท้ายที่คุณจะใช้ในการร้องขอข้อมูลจาก API เป็น URL นี้เสมอ อย่าสับสนกับ URL ที่ลงนามด้วยลายเซ็น
//     const TT_REQ_PERM_URL =
//         "https://www.tiktok.com/api/user/detail/?WebIdLastTime=1684959661&abTestVersion=%5Bobject%20Object%5D&aid=1988&appType=m&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&device_id=7236846595559933400&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=&tz_name=Europe%2FBucharest&uniqueId=&user=%5Bobject%20Object%5D&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=gGkV_K79_CgoknlGzARe-cvv4ZSaZef9sjd_u6jSxLNHchbi_ZF9hPG_35EoQcHxHDAJkb4dDW9gec1CKXWV3ELFQ6bVUUSQBsj1Vfi_feLstK-6SHMxJMVc-Zvm6xA9AMUG&X-Bogus=DFSzswVue6zANHsMt5bgO74m8icv&_signature=_02B4Z6wo00001Xk8yMwAAIDCifeiRAutXwV5PMxAADhW65";

//     // หากคุณได้รับผลลัพธ์ว่างเปล่า ให้เปลี่ยนค่า verifyFp, msToken, X-Bogus และ _signature

//     // แปรสภาพ URL
//     const parsedUrl = new URL(TT_REQ_PERM_URL);

//     // แยกพารามิเตอร์จาก query string
//     const parsedQuery = querystring.parse(parsedUrl.search.slice(1));

//     const PARAMS = {
//         count: 30,
//         device_id: '7236846595559933400',
//         secUid: "",
//         uniqueId: USER_UNIQUE_ID,
//         cursor: 0,
//     };
//     // รวมพารามิเตอร์จาก parsedQuery และ PARAMS
//     const mergedParams = { ...parsedQuery, ...PARAMS };


//     async function main() {
//         const signer = new Signer(null, USER_AGENT);
//         await signer.init(); // เริ่มต้นการทำงานของ Signer

//         const qsObject = new URLSearchParams(mergedParams);
//         const qs = qsObject.toString();

//         const unsignedUrl = `https://www.tiktok.com/api/user/detail?${qs}`;

//         const signature = await signer.sign(unsignedUrl); // ลงนามด้วยลายเซ็นใน URL
//         const navigator = await signer.navigator(); // รับข้อมูลเกี่ยวกับเบราว์เซอร์และระบบปฏิบัติการ
//         await signer.close(); // ปิดการทำงานของ Signer


//         const { "x-tt-params": xTtParams, signed_url } = signature;
//         const { user_agent: userAgent } = navigator;

//         const res = await testApiReq({ userAgent, xTtParams, signed_url });
//         const { data } = res;
//         console.log(data); // แสดงผลลัพธ์ที่ได้จากการร้องขอ API
//         // console.log(data.userInfo.user.nickname)
//         const channel = client.channels.cache.get('1240554928024326175');
//         const embed = new EmbedBuilder()
//             .setColor('#ff0050') // กำหนดสีของ Embed 🎨
//             .setTitle(`${data.userInfo.user.nickname} on TikTok`) // ชื่อผู้ใช้ 🕴️
//             .setURL(`https://www.tiktok.com/@${data.userInfo.user.uniqueId}`) // ลิงก์ไปยังโปรไฟล์ TikTok 🌐
//             .setThumbnail(data.userInfo.user.avatarMedium) // รูปโปรไฟล์ขนาดกลาง 🖼️
//             .addFields(
//                 { name: 'Followers 👥', value: data.userInfo.stats.followerCount.toLocaleString(), inline: true }, // จำนวนผู้ติดตาม
//                 { name: 'Following 👤', value: data.userInfo.stats.followingCount.toLocaleString(), inline: true }, // จำนวนที่ติดตามอยู่
//                 { name: 'Likes ❤️', value: data.userInfo.stats.heartCount.toLocaleString(), inline: true }, // จำนวน Likes
//                 { name: 'Videos 🎥', value: data.userInfo.stats.videoCount.toLocaleString(), inline: true } // จำนวนวิดีโอ
//             )
//             .setDescription(data.shareMeta.desc) // คำอธิบายโปรไฟล์ 📝
//             .setTimestamp() // เวลาปัจจุบัน ⌚
//             .setFooter({ text: 'Data from TikTok API 🔗' }); // ข้อความท้ายของ Embed

//         // ส่ง Embed ไปยังช่องแชท
//         channel.send({ embeds: [embed] });
//     }

//     async function testApiReq({ userAgent, xTtParams, signed_url }) {
//         const options = {
//             method: "GET",
//             headers: {
//                 "user-agent": userAgent,
//                 "x-tt-params": xTtParams,
//             },
//             url: signed_url,
//         };
//         return axios(options); // ร้องขอข้อมูลผู้ใช้จาก API ของ TikTok
//     }

//     main(); // เรียกใช้ฟังก์ชันหลัก
// }