const { Client, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const config = require('../../../config/config_for_youtubenotify.json');
const Video = require('../../Schemas/yt_noti_db'); // Update the path to your model

// Function to retry fetching with exponential backoff
async function fetchWithRetry(url, options = {}, retries = 3, backoff = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.text();
        } catch (error) {
            if (attempt < retries) {
                console.warn(`Attempt ${attempt} failed. Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                backoff *= 2; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
}

// Function to fetch the latest video and channel name from the RSS feed
async function getLatestVideo(channelId) {
    try {
        const data = await fetchWithRetry(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { timeout: 10000 });
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(data);
        const videoEntry = result.feed.entry[0];
        const channelTitle = result.feed.title[0];
        return { videoEntry, channelTitle };
    } catch (error) {
        console.error(`Error fetching video for channel ${channelId}:`, error);
        throw error;
    }
}

// Function to send notifications to the Discord channel
async function sendNotification(client, { videoEntry, channelTitle }) {
    const channel = client.channels.cache.get(config.channel);
    if (!channel) {
        console.error('Discord channel not found');
        return;
    }

    const currentVideoId = videoEntry['yt:videoId'][0];
    const existingVideo = await Video.findOne({ videoId: currentVideoId });
    if (existingVideo) return;

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

    const newVideoData = new Video({
        videoId: currentVideoId,
        title: videoTitle,
        publishedAt: new Date(videoEntry.published[0]),
        channelTitle: channelTitle
    });

    try {
        await newVideoData.save();
        await channel.send({ embeds: [embedMessage] });
        const chalk = await import('chalk');
        console.log(chalk.default.hex('#ECE81A').bold(`${chalk.default.hex('#e23a08').bold(`🔔[Youtube]`)} [${channelTitle}] ${chalk.default.hex('#ffffff').bold(`>>`)} ${chalk.default.blue.underline.bold(videoTitle)}`));
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Main function to check for new videos and send notifications
async function checkForNewVideos(client) {
    try {
        setTimeout(function () {
            server.close(() => {
                console.log("Server shutdown completed.");
                process.exit(1);
            });
        }, 1 * 60 * 60 * 1000);
        const videoPromises = config.channel_id.map(channelId => getLatestVideo(channelId));
        const videos = await Promise.all(videoPromises);
        for (const videoData of videos) {
            await sendNotification(client, videoData);
        }
    } catch (error) {
        console.error('Error checking for new videos:', error);
    }
}

module.exports = (client) => {
    setInterval(() => checkForNewVideos(client), config.watchInterval);
};
