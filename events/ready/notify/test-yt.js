// const Signer = require("tiktok-signature");
// const axios = require("axios"); // NOTE: not adding this to package.json, you'll need to install it manually
// const querystring = require('querystring');
// const video = require('../../Schemas/test-tiktok-notify');
// const { EmbedBuilder, time, TimestampStyles } = require('discord.js');
// // Get your SEC_UID from https://t.tiktok.com/api/user/detail/?aid=1988&uniqueId=username&language=it
// // where `username` is your TikTok username.
// const SEC_UID =
//     "MS4wLjABAAAAp08a2df-1SuQK7T2h1tvUS_NfKGm50UQyakEC2C783ZWycD7ObXjTNGnHyheoEUv";
// // We use Apple, based on the issue comments in the repo, this helps prevent TikTok's captcha from triggering
// const TT_REQ_USER_AGENT =
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56";
// // This the final URL you make a request to for the API call, it is ALWAYS this, do not mistaken it for the signed URL
// const TT_REQ_PERM_URL = "https://www.tiktok.com/api/post/item_list/?sort=create_time&WebIdLastTime=1684959661&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&device_id=7236846595559933467&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=MS4wLjABAAAATdiadghBG5ZZqRrY93j0-jyzqPW_toWf5ir6b9aeB64HebodSB1scEXNpC020bPq&tz_name=Europe%2FBucharest&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=riqlJPr42AMSGAwHu9g9z5PhCqn3Hzp-CjRpNH8XqPTcwNCehHnQqvP5BAgx7HwkuQfAcVxbttMfK3fGHZvUXYB__GZK7iWaYaItDzaDJxeVock0JIurABWe1b5T30PY61UM&X-Bogus=DFSzswVurstANHsMt5bgOw4m8iGH&_signature=_02B4Z6wo00001tPwkyAAAIDBIzv5q2eTgMbT8JeAANLu81";
// // Parse the URL
// const parsedUrl = new URL(TT_REQ_PERM_URL);
// // Extract the query parameters
// const parsedQuery = querystring.parse(parsedUrl.search.slice(1));
// const PARAMS = {
//     count: 3,
//     device_id: '7165118680723998211',
//     secUid: SEC_UID,
//     cursor: 0,
// };
// // Merge parsedQuery with PARAMS
// const mergedParams = { ...parsedQuery, ...PARAMS };
// async function testApiReq({ userAgent, xTtParams, signed_url }) {
//     const options = {
//         method: "GET",
//         headers: {
//             "user-agent": userAgent,
//             "x-tt-params": xTtParams,
//         },
//         url: signed_url,
//         timeout: 6000,
//     };
//     return axios(options);
// }
// module.exports = (client) => {
//     async function main() {
//         const signer = new Signer(null, TT_REQ_USER_AGENT);
//         await signer.init();
//         if (!signer) throw new Error('การเริ่มต้น signer ล้มเหลว');
//         const qsObject = new URLSearchParams(mergedParams);
//         const qs = qsObject.toString();
//         const unsignedUrl = `https://www.tiktok.com/api/post/item_list/?${qs}`;
//         const signature = await signer.sign(unsignedUrl);
//         const navigator = await signer.navigator();
//         await signer.close();
//         const { "x-tt-params": xTtParams, signed_url } = signature;
//         const { user_agent: userAgent } = navigator;
//         const res = await testApiReq({ userAgent, xTtParams, signed_url });
//         const { data } = res;
//         if (!data || !data.itemList) return;
//         const sortedItemList = data.itemList.sort((a, b) => a.createTime - b.createTime);
//         const icon_ = `<\:tiktok:1245956894133194826>`;
//         const channel = client.channels.cache.get('1248577221728403556');
//         for (const item of sortedItemList) {
//             const check_is_new_video = await video.findOne({ id: item.id });
//             if (!check_is_new_video) {
//                 const publishedDate = new Date(item.createTime * 1000).toLocaleString();
//                 const relativeTime = time(item.createTime, TimestampStyles.RelativeTime);
//                 console.log(`[Test_tiktok][${publishedDate}]New video: ` + item.id);
//                 setTimeout(async () => {     
//                     const embed = new EmbedBuilder()
//                         .setColor('White')
//                         .setTitle(`${icon_}|${item.author.nickname} บน TikTok 🎥`)
//                         .setURL(`https://www.tiktok.com/@${item.author.nickname}/video/${item.id}`)
//                         .setThumbnail(item.author.avatarMedium)
//                         .setImage(item.video.cover)
//                         .addFields(
//                             { name: '⏰ เผยแพร่เมื่อ', value: `${publishedDate} | ${relativeTime} ที่เเล้ว`, inline: true },
//                             { name: '\u200B', value: '\u200B', inline: true }
//                         )
//                         .setDescription(`📜 \`${item.desc}\` `)
//                         .setTimestamp()
//                         .setFooter({ text: `ข้อมูลจาก TikTok API 🔗` });
//                     await channel.send({ embeds: [embed] });
//                     const newVideoData = new video({ id: item.id });
//                     await newVideoData.save();
//                 }, 3000)
//             }
//         }
//     }
//     setInterval(() => {
//         main();
//     }, 10000);
// }

