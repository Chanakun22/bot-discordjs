const Signer = require("tiktok-signature");
const axios = require("axios");
const querystring = require('querystring');
const { EmbedBuilder, time, TimestampStyles } = require('discord.js');
const Video = require('../../Schemas/tiktok_noti_db');

module.exports = async (client) => {
    try {
        const SEC_UID = "MS4wLjABAAAAp08a2df-1SuQK7T2h1tvUS_NfKGm50UQyakEC2C783ZWycD7ObXjTNGnHyheoEUv";
        const TT_REQ_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56";
        const TT_REQ_PERM_URL = "https://www.tiktok.com/api/post/item_list/?sort=create_time&WebIdLastTime=1684959661&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&device_id=7236846595559933467&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=MS4wLjABAAAATdiadghBG5ZZqRrY93j0-jyzqPW_toWf5ir6b9aeB64HebodSB1scEXNpC020bPq&tz_name=Europe%2FBucharest&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=riqlJPr42AMSGAwHu9g9z5PhCqn3Hzp-CjRpNH8XqPTcwNCehHnQqvP5BAgx7HwkuQfAcVxbttMfK3fGHZvUXYB__GZK7iWaYaItDzaDJxeVock0JIurABWe1b5T30PY61UM&X-Bogus=DFSzswVurstANHsMt5bgOw4m8iGH&_signature=_02B4Z6wo00001tPwkyAAAIDBIzv5q2eTgMbT8JeAANLu81";

        const parsedUrl = new URL(TT_REQ_PERM_URL);
        const parsedQuery = querystring.parse(parsedUrl.search.slice(1));

        const PARAMS = {
            count: 9,
            device_id: '7165118680723998211',
            secUid: SEC_UID,
            cursor: 0,
        };

        const mergedParams = { ...parsedQuery, ...PARAMS };

        async function main() {
            let signer;
            try {
                signer = new Signer(null, TT_REQ_USER_AGENT);
                await signer.init();

                if (!signer) throw new Error('การเริ่มต้น signer ล้มเหลว');

                const qsObject = new URLSearchParams(mergedParams);
                const unsignedUrl = `https://www.tiktok.com/api/post/item_list/?${qsObject.toString()}`;

                // ตรวจสอบว่าหน้าเพจยังคงเปิดอยู่ก่อนที่จะเรียกใช้ฟังก์ชัน sign
                if (!signer.page || signer.page.isClosed()) {
                    throw new Error('Page ถูกปิดไปก่อนที่จะเรียกใช้ฟังก์ชัน sign');
                }

                const signature = await signer.sign(unsignedUrl);
                const navigator = await signer.navigator();

                if (!signature || !navigator) throw new Error('ล้มเหลวในการรับ signature หรือรายละเอียด navigator');

                const { "x-tt-params": xTtParams, signed_url } = signature;
                const { user_agent: userAgent } = navigator;
                const res = await testApiReq({ userAgent, xTtParams, signed_url });
                const { data } = res;

                if (!data || !data.itemList) throw new Error('ไม่ได้รับข้อมูลหรือไม่มีรายการ');

                const sortedItemList = data.itemList.sort((a, b) => a.createTime - b.createTime);

                for (const item of sortedItemList) {
                    if (await Video.findOne({ id: item.id })) continue;

                    const currentVideoId = item.id;
                    if (!currentVideoId) continue;

                    const existingVideo = await Video.findOne({ id: currentVideoId });
                    if (!existingVideo) {
                        const channel = client.channels.cache.get('1241686994606620773');
                        const publishedDate = new Date(item.createTime * 1000).toLocaleString();
                        const relativeTime = time(item.createTime, TimestampStyles.RelativeTime);
                        const icon_ = `<\:tiktok:1245956894133194826>`;

                        const embed = new EmbedBuilder()
                            .setColor('White')
                            .setTitle(`${icon_}|${item.author.nickname} บน TikTok 🎥`)
                            .setURL(`https://www.tiktok.com/@${item.author.nickname}/video/${item.id}`)
                            .setThumbnail(item.author.avatarMedium)
                            .setImage(item.video.cover)
                            .addFields(
                                { name: '⏰ เผยแพร่เมื่อ', value: `${publishedDate} | ${relativeTime} ที่เเล้ว`, inline: true },
                                { name: '\u200B', value: '\u200B', inline: true }
                            )
                            .setDescription(`📜 \`${item.desc}\` `)
                            .setTimestamp()
                            .setFooter({ text: `ข้อมูลจาก TikTok API 🔗` });

                        const newVideoData = new Video({ id: currentVideoId });
                        await newVideoData.save();
                        await channel.send({ embeds: [embed] });

                        const chalk = await import('chalk');
                        console.log(chalk.default.hex('#ECE81A').bold(chalk.default.hex('#ffffff').bold(`🔔[Tiktok]`) + `[${item.author.nickname}]` + chalk.default.hex('#ffffff').bold(`>>`) + chalk.default.blue.underline.bold(` ${item.desc}`)));
                    }
                }
            } catch (error) {
                console.error(`[main tik] >> ${error.message}`);
                if (error.message.includes('net::ERR_ABORTED')) {
                    console.error('เกิดข้อผิดพลาดเครือข่ายหรือเฟรมถูกยกเลิก ลองใหม่...');
                } else if (error.message.includes('Page ถูกปิดไปก่อนที่จะเรียกใช้ฟังก์ชัน sign')) {
                    console.error('Page ถูกปิดไปก่อนที่จะเรียกใช้ฟังก์ชัน sign ลองใหม่...');
                } else {
                    console.error('เกิดข้อผิดพลาดที่ไม่รู้จัก ลองใหม่...');
                }
            } finally {
                if (signer) await signer.close();
            }
        }

        async function testApiReq({ userAgent, xTtParams, signed_url }) {
            const headers = {
                'authority': 'www.tiktok.com',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9',
                'referer': 'https://www.tiktok.com/',
                'user-agent': userAgent,
                'x-tt-params': xTtParams,
            };
            const { data } = await axios.get(signed_url, { headers, timeout: 10000 });
            return { data };
        }

        setTimeout(() => {
            main();
        }, 10000);
        setInterval(main, 60000);
    } catch (error) {
        console.error(`[module] >> ${error.message}`);
    }
};
