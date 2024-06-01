const Signer = require("tiktok-signature");
const axios = require("axios");
const querystring = require('querystring');
const { EmbedBuilder, time, TimestampStyles } = require('discord.js');
const Video = require('../../Schemas/tiktok_noti_db_korn');

module.exports = async (client) => {
    try {
        const SEC_UID = "MS4wLjABAAAAIirjlzb2JndzJyjzP8H03csQ8dw3wsYCsa1SIoSAZYnpvOzU2a6BAb0ycfE-aTv4"; // TikTok user ID
        const TT_REQ_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56"; // User agent string for requests
        const TT_REQ_PERM_URL = "https://www.tiktok.com/api/post/item_list/?WebIdLastTime=1684959661&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&device_id=7236846595559933467&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=MS4wLjABAAAATdiadghBG5ZZqRrY93j0-jyzqPW_toWf5ir6b9aeB64HebodSB1scEXNpC020bPq&tz_name=Europe%2FBucharest&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=riqlJPr42AMSGAwHu9g9z5PhCqn3Hzp-CjRpNH8XqPTcwNCehHnQqvP5BAgx7HwkuQfAcVxbttMfK3fGHZvUXYB__GZK7iWaYaItDzaDJxeVock0JIurABWe1b5T30PY61UM&X-Bogus=DFSzswVurstANHsMt5bgOw4m8iGH&_signature=_02B4Z6wo00001tPwkyAAAIDBIzv5q2eTgMbT8JeAANLu81"; // TikTok API request URL

        const parsedUrl = new URL(TT_REQ_PERM_URL); // Parse the request URL
        const parsedQuery = querystring.parse(parsedUrl.search.slice(1)); // Parse the query string from the URL

        // Parameters for the API request
        const PARAMS = {
            count: 2, // Changed count to 5 to get more than 1 video
            device_id: '7165118680723998211',
            secUid: SEC_UID,
            cursor: 0,
        };

        const mergedParams = { ...parsedQuery, ...PARAMS }; // Merge the parsed query with the parameters

        async function main() {

            let signer;
            try {
                signer = new Signer(null, TT_REQ_USER_AGENT); // Initialize the Signer with the user agent
                await signer.init(); // Initialize the signer

                const qsObject = new URLSearchParams(mergedParams); // Convert merged parameters to URLSearchParams
                const qs = qsObject.toString(); // Convert URLSearchParams to string

                const unsignedUrl = `https://www.tiktok.com/api/post/item_list/?${qs}`; // Construct the unsigned URL
                const signature = await signer.sign(unsignedUrl); // Sign the URL
                const navigator = await signer.navigator(); // Get navigator details
                const { "x-tt-params": xTtParams, signed_url } = signature; // Extract signed URL and parameters
                const { user_agent: userAgent } = navigator; // Extract user agent

                const res = await testApiReq({ userAgent, xTtParams, signed_url }); // Make the API request
                const { data } = res; // Extract response data

                if (!data) return; // If no data, exit

                const itemList = data.itemList; // Get the list of videos
                for (const item of itemList) {
                    const currentVideoId = item.id; // Get the ID of the video
                    if (!currentVideoId) continue; // Skip if no video ID

                    const existingVideo = await Video.findOne({ id: currentVideoId }); // Check if the video already exists in the database
                    if (!existingVideo) {
                        const channel = client.channels.cache.get('1241686994606620773'); // Get the Discord channel
                        const publishedDate = new Date(item.createTime * 1000).toLocaleString(); // Convert the publish date to a readable format
                        const relativeTime = time(item.createTime, TimestampStyles.RelativeTime);
                        const icon_ = `<\:tiktok:1245956894133194826>`
                        // Create an embed message
                        const embed = new EmbedBuilder()
                            .setColor('White')
                            .setTitle(`${icon_}|${item.author.nickname} บน TikTok 🎥`)
                            .setURL(`https://www.tiktok.com/@${item.author.nickname}/video/${item.id}`)
                            .setThumbnail(item.author.avatarMedium)
                            .setImage(item.video.cover)
                            .addFields(
                                { name: '⏰ เผยแพร่เมื่อ', value: `${publishedDate} |   ${relativeTime} ที่เเล้ว`, inline: true },
                                { name: '\u200B', value: '\u200B', inline: true }
                            )
                            .setDescription(`📜 \`${item.desc}\` `)
                            .setTimestamp()
                            .setFooter({ text: `ข้อมูลจาก TikTok API 🔗` });

                        const newVideoData = new Video({
                            id: currentVideoId,
                        });
                        (async () => {
                            const chalk = await import('chalk');
                            console.log(chalk.default.hex('#ECE81A').bold(chalk.default.hex('#ffffff').bold(`🔔[Tiktok]`) + `[${item.author.nickname}]` + chalk.default.hex('#ffffff').bold(`>>`) + chalk.default.blue.underline.bold(` ${item.desc}`)));
                        })();
                        await newVideoData.save(); // Save the new video to the database
                        await channel.send({ embeds: [embed] }); // Send the embed message to the Discord channel
                    }
                }
            } catch (error) {
                console.error(`[main - Korn] >> ${error.message}`); // Log the error message
                if (error.name === 'Error' && error.message.includes('net::ERR_ABORTED')) {
                    console.error('Network error or frame detached. Retrying...'); // Specific error handling for network errors
                } else {
                    console.error('An unexpected error occurred:', error); // General error handling
                }
            } finally {
                if (signer) {
                    await signer.close(); // Close the signer
                }
            }
        }

        // Function to make the API request
        async function testApiReq({ userAgent, xTtParams, signed_url }) {
            try {
                const options = {
                    method: "GET",
                    headers: {
                        "user-agent": userAgent,
                        "x-tt-params": xTtParams,
                    },
                    url: signed_url,
                };
                return await axios(options); // Perform the request using axios
            } catch (error) {
                console.error(`[testApiReq] >> ${error.message}`); // Log any errors that occur
                throw error; // Re-throw the error to be handled by the caller
            }
        }

        setInterval(() => { main(); }, 60000); // Run the main function every 60 seconds
    } catch (error) {
        console.error(`[tiktok_user] >> ${error.message}`); // Log any errors that occur during module initialization
    }
};
