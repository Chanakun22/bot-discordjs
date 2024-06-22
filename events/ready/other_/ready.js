const { Client, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;


module.exports = async (client) => {
    // console.clear();

    (async () => {
        const chalk = await import('chalk');
        console.log(chalk.default.hex('#DEADED').bold(`${client.user.tag} is Ready`));
    })();

    if (!mongoURL) {
        console.log('MongoDB URL not provided. Please set the mongoURL in your environment variables.');
        return;
    }

    try {
        console.time('Connect to database');
        await mongoose.connect(mongoURL);
        console.timeEnd('Connect to database');
        console.log('Connected to database');
    } catch (error) {
        console.error('Could not connect to database:', error);
        return;
    }

    const setPresence = async () => {
        const now = new Date();
        const formattedTime = new Intl.DateTimeFormat('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(now);

        client.user.setPresence({
            activities: [{ name: `⏰: ${formattedTime}`, type: ActivityType.Watching }],
            status: 'dnd'
        });
    };

    setPresence();
    setInterval(setPresence, 60000); // อัปเดตสถานะของบอททุกๆ 60 วินาที
};

