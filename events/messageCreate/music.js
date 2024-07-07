// const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
// const ytdl = require('ytdl-core');
// const YouTube = require("youtube-sr").default;

// async function searchYouTube(query) {
//     const video = await YouTube.searchOne(query);
//     return video ? video.url : null;
// }

// const rq_ch = '1255120836512448512';

// async function playAudio(url, voiceChannel, message) {
//     const connection = joinVoiceChannel({
//         channelId: voiceChannel.id,
//         guildId: voiceChannel.guild.id,
//         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
//     });

//     const stream = ytdl(url, { 
//         filter: 'audioonly',
//         highWaterMark: 1 << 25 // เพิ่ม buffer size
//     });
//     const resource = createAudioResource(stream);
//     const player = createAudioPlayer();

//     player.play(resource);
//     connection.subscribe(player);

//     player.on(AudioPlayerStatus.Idle, () => {
//         message.channel.send('เพลงจบแล้ว กำลังออกจากห้องเสียง');
//         connection.destroy();
//     });

//     player.on('error', error => {
//         console.error('เกิดข้อผิดพลาดในการเล่นเพลง:', error);
//         message.channel.send('เกิดข้อผิดพลาดในการเล่นเพลง กำลังลองใหม่...');
//         setTimeout(() => playAudio(url, voiceChannel, message), 5000); // ลองเล่นใหม่หลังจาก 5 วินาที
//     });

//     return player;
// }

// module.exports = async (message, client) => {
//     if(message.channel.id !== rq_ch && !message.author.bot) return message.reply({content: 'ไม่สามารถขอเพลงในห้องนี้ได้ [กรุณาเข้าไปขอในห้องขอเพลงของbot]', ephemeral: true});

//     const prefix = '!';
//     if (!message.content.startsWith(prefix) || message.author.bot) return;

//     const args = message.content.slice(prefix.length).trim().split(/ +/);
//     const command = args.shift().toLowerCase();

//     if (command === 'play') {
//         if (!args.length) {
//             return message.channel.send('กรุณาระบุชื่อเพลงหรือลิงก์ YouTube!');
//         }
//         const voiceChannel = message.member.voice.channel;
//         if (!voiceChannel) return message.channel.send('คุณต้องอยู่ในห้องเสียงก่อน!');

//         try {
//             let url;
//             if (ytdl.validateURL(args[0])) {
//                 url = args[0];
//             } else {
//                 const query = args.join(' ');
//                 message.reply({content: `กำลังค้นหาเพลง: ${query}`, ephemeral: true});
//                 url = await searchYouTube(query);
//                 if (!url) {
//                     return message.channel.send('ไม่พบเพลงที่ค้นหา');
//                 }
//             }

//             const videoInfo = await ytdl.getInfo(url);
//             message.channel.send(`กำลังเล่นเพลง: ${videoInfo.videoDetails.title}`);

//             await playAudio(url, voiceChannel, message);

//         } catch (error) {
//             console.error(error);
//             message.channel.send('เกิดข้อผิดพลาดในการเล่นเพลง');
//         }
//     } else if (command === 'stop') {
//         const connection = getVoiceConnection(message.guild.id);
//         if (connection) {
//             connection.destroy();
//             message.channel.send('หยุดเล่นเพลงและออกจากห้องเสียงแล้ว');
//         } else {
//             message.channel.send('Bot ไม่ได้อยู่ในห้องเสียง');
//         }
//     }
// }