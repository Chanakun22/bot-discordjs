const { Client, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const config = require('../../../config/config_for_youtubenotify.json');
const Video = require('../../Schemas/yt_noti_db'); // Update the path to your model


// Function to fetch the latest video and channel name from the RSS feed
module.exports = async (client) => {
    async function getLatestVideo(channelId) {
        const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        const data = await response.text();
        const parser = new xml2js.Parser();
        return new Promise((resolve, reject) => {
            parser.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const videoEntry = result.feed.entry[0];
                    const channelTitle = result.feed.title[0];
                    resolve({ videoEntry, channelTitle });
                }
            });
        });
    }

    // Function to send notifications to the Discord channel
    async function sendNotification({ videoEntry, channelTitle }) {
        const channel = client.channels.cache.get(config.channel);
        if (channel) {
            try {
                // Find the latest video from the database
                const currentVideoId = videoEntry['yt:videoId'][0];
                const existingVideo = await Video.findOne({ videoId: currentVideoId });
                if (!existingVideo) {
                    // New video, create and send embed message
                    const videoTitle = videoEntry.title[0];
                    const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
                    const publishedDate = new Date(videoEntry.published[0]).toLocaleString();
                    const thumbnailUrl = `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`;
                    const embedMessage = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle(`📺 ${videoTitle}`)
                        .setURL(videoUrl)
                        .setAuthor({ name: channelTitle, iconURL: 'https://i.imgur.com/AfFp7pu.png' })
                        .setImage(thumbnailUrl)
                        .addFields(
                            { name: '⏰Published', value: publishedDate, inline: true },
                            { name: '\u200B', value: '\u200B', inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: '🆕 New video uploaded!' });
                    // Save the video data to the database
                    const newVideoData = new Video({
                        videoId: currentVideoId,
                        title: videoTitle,
                        publishedAt: new Date(videoEntry.published[0]),
                        channelTitle: channelTitle
                    });
                    await newVideoData.save();
                    console.log(`Video saved to database: ${videoTitle}`);
                    // Send the embed message to the Discord channel
                    await channel.send({ embeds: [embedMessage] });
                    console.log(`[${channelTitle}]: ${videoTitle} VideoId: ${currentVideoId}`);
                }
            } catch (err) {
                console.error('Error sending notification:', err);
            }
        } else {
            console.error('Discord channel not found');
        }
    }
    // Check for new videos every 5 minutes
    setInterval(async () => {
        for (const channelId of config.channel_id) {
            const { videoEntry, channelTitle } = await getLatestVideo(channelId);
            sendNotification({ videoEntry, channelTitle });
        }
    }, config.watchInterval);
}