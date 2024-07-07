const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, TimestampStyles, time } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { PermissionsBitField } = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require("youtube-sr").default;
const db = require('../../events/Schemas/music_bot_embed_db');

const rq_ch = '1255120836512448512';
const queues = new Map();

async function getGlobalMusicEmbed(guildId) {
    const embedData = await db.findOne({ guildId });
    return embedData ? embedData.embedMessageId : null;
}

async function setGlobalMusicEmbed(guildId, embedMessageId) {
    await db.findOneAndUpdate(
        { guildId },
        { embedMessageId },
        { upsert: true, new: true }
    );
}

function getServerQueue(guildId) {
    if (!queues.has(guildId)) {
        queues.set(guildId, {
            textChannel: null,
            voiceChannel: null,
            connection: null,
            songs: [],
            volume: 5,
            playing: false,
            playEmbed: null,
        });
    }
    return queues.get(guildId);
}

function formatDuration(duration) {
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + duration * 1000);
    return time(futureTime, TimestampStyles.RelativeTime);
}

function createMusicEmbed(song, queue) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `YouTube Music Bot`, iconURL: song.avatar })
        .setColor('Blue')
        .setTitle('เพลงที่กำลังเล่น')
        .setDescription(`**[${song.title}](${song.url})**`)
        .addFields(
            { name: 'ระยะเวลา', value: song.duration, inline: true },
            { name: 'ขอโดย', value: `${song.requester}`, inline: true },
            { name: 'ห้อง', value: `${song.voiceChannel}`, inline: true }

        )
        .setImage(song.thumbnail)
        .setTimestamp(new Date());



    if (queue && queue.length > 0) {
        const queueList = queue.slice(0, 5).map((song, index) =>
            `${index + 1}. ${song.title.substring(0, 30)}${song.title.length > 30 ? '...' : ''}`
        ).join('\n');

        const remainingSongs = queue.length > 5 ? `\nและอีก ${queue.length - 5} เพลง` : '';

        embed.addFields({ name: 'เพลงในคิว', value: queueList + remainingSongs });
    } else {
        embed.addFields({ name: 'เพลงในคิว', value: 'ไม่มีเพลงในคิว' });
    }

    return embed;
}

async function searchYouTube(query) {
    const video = await YouTube.searchOne(query);
    return video ? video.url : null;
}

// แก้ไขฟังก์ชันนี้
async function updateOrSendEmbed(channel, song, queue, guildId) {
    const embed = createMusicEmbed(song, queue);
    let globalMusicEmbedId = await getGlobalMusicEmbed(guildId);
    let globalMusicEmbed;

    if (!globalMusicEmbedId) {
        // สร้าง embed ใหม่
        globalMusicEmbed = await channel.send({ embeds: [embed] });
        // อัปเดตฐานข้อมูลด้วย ID ของ embed ใหม่
        await setGlobalMusicEmbed(guildId, globalMusicEmbed.id);
    } else {
        try {
            globalMusicEmbed = await channel.messages.fetch(globalMusicEmbedId);
            await globalMusicEmbed.edit({ embeds: [embed] });
        } catch (error) {
            console.error("ไม่สามารถหา embed ที่มีอยู่ได้:", error);
            // หากไม่พบข้อความเดิม ให้สร้างใหม่และอัปเดตฐานข้อมูล
            globalMusicEmbed = await channel.send({ embeds: [embed] });
            await setGlobalMusicEmbed(guildId, globalMusicEmbed.id);
        }
    }
}

async function playSong(guildId, song) {
    const serverQueue = getServerQueue(guildId);

    if (!song) {
        serverQueue.playing = false;
        if (serverQueue.connection) {
            serverQueue.connection.destroy();
            serverQueue.connection = null;
        }
        let globalMusicEmbedId = await getGlobalMusicEmbed(guildId);
        if (globalMusicEmbedId) {
            const globalMusicEmbed = await serverQueue.textChannel.messages.fetch(globalMusicEmbedId);
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('/music play เพื่อเล่นเพลง /music stop เพื่อหยุดเล่นเพลง')
                .setDescription(`ไม่มีเพลง`) 
                .addFields(
                    { name: 'ระยะเวลา', value: '-', inline: true },
                    { name: 'ขอโดย', value: '-', inline: true },
                )
                .setImage(null)
                .setTimestamp(new Date());
            await globalMusicEmbed.edit({ embeds: [embed] });
        }
        return;
    }

    const videoInfo = await ytdl.getInfo(song.url);
    song.duration = formatDuration(parseInt(videoInfo.videoDetails.lengthSeconds));

    const stream = ytdl(song.url, {
        filter: 'audioonly',
        highWaterMark: 1 << 25
    });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    serverQueue.connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, async () => {
        serverQueue.songs.shift();
        if (serverQueue.songs.length > 0) {
            playSong(guildId, serverQueue.songs[0]);
            // แก้ไขการเรียกใช้ updateOrSendEmbed ที่นี่
            await updateOrSendEmbed(serverQueue.textChannel, serverQueue.songs[0], serverQueue.songs.slice(1), guildId);
        } else {
            serverQueue.playing = false;
            if (serverQueue.connection) {
                serverQueue.connection.destroy();
                serverQueue.connection = null;
            }
            let globalMusicEmbedId = await getGlobalMusicEmbed(guildId);
            if (globalMusicEmbedId) {
                const globalMusicEmbed = await serverQueue.textChannel.messages.fetch(globalMusicEmbedId);
                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('/music play เพื่อเล่นเพลง /music stop เพื่อหยุดเล่นเพลง')
                .setDescription(`ไม่มีเพลง`) 
                .addFields(
                    { name: 'ระยะเวลา', value: '-', inline: true },
                    { name: 'ขอโดย', value: '-', inline: true }
                )
                .setImage(null)
                .setTimestamp(new Date());
            await globalMusicEmbed.edit({ embeds: [embed] });
            }
        }
    });

    player.on('error', error => {
        console.error('เกิดข้อผิดพลาดในการเล่นเพลง:', error);
        serverQueue.textChannel.send({ content: 'เกิดข้อผิดพลาดในการเล่นเพลง กำลังเล่นเพลงถัดไป...' });
        serverQueue.songs.shift();
        playSong(guildId, serverQueue.songs[0]);
    });

    // แก้ไขการเรียกใช้ updateOrSendEmbed ที่นี่
    await updateOrSendEmbed(serverQueue.textChannel, song, serverQueue.songs.slice(1), guildId);
}

async function handlePlay(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply({ content: 'คุณต้องอยู่ในห้องเสียงก่อน!', ephemeral: true });
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
        return interaction.reply({ content: 'ไม่มีสิทธิ์ในการเข้าร่วมและพูดในห้องเสียงนี้!', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        let url;
        if (ytdl.validateURL(query)) {
            url = query;
        } else {
            await interaction.editReply({ content: `กำลังค้นหาเพลง: ${query}` });
            url = await searchYouTube(query);
            if (!url) {
                return interaction.editReply({ content: 'ไม่พบเพลงที่ค้นหา' });
            }
        }
        const videoInfo = await ytdl.getInfo(url);
        const song = {
            title: videoInfo.videoDetails.title,
            url: url,
            thumbnail: videoInfo.videoDetails.thumbnails[3].url,
            duration: formatDuration(parseInt(videoInfo.videoDetails.lengthSeconds)),
            requester: interaction.member.user,
            avatar: interaction.user.displayAvatarURL(),
            voiceChannel: interaction.member.voice.channel
        };


        const serverQueue = getServerQueue(interaction.guild.id);

        if (!serverQueue.playing) {
            serverQueue.textChannel = interaction.channel;
            serverQueue.voiceChannel = voiceChannel;
            serverQueue.songs.push(song);
            serverQueue.playing = true;

            try {
                const connection = await joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                serverQueue.connection = connection;
                await playSong(interaction.guild.id, serverQueue.songs[0]);
                await interaction.editReply({ content: 'เริ่มเล่นเพลงแล้ว' });
            } catch (err) {
                console.error(err);
                queues.delete(interaction.guild.id);
                return interaction.editReply({ content: 'เกิดข้อผิดพลาดในการเชื่อมต่อห้องเสียง' });
            }
        } else {
            serverQueue.songs.push(song);
            // แก้ไขการเรียกใช้ updateOrSendEmbed ที่นี่
            await updateOrSendEmbed(interaction.channel, serverQueue.songs[0], serverQueue.songs.slice(1), interaction.guild.id);
            return interaction.editReply({ content: `เพิ่ม ${song.title} เข้าคิวแล้ว` });
        }
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: 'เกิดข้อผิดพลาดในการเล่นเพลง' });
    }
}

async function handleStop(interaction) {
    const serverQueue = getServerQueue(interaction.guild.id);
    if (serverQueue && serverQueue.connection) {
        serverQueue.songs = [];
        serverQueue.connection.destroy();
        serverQueue.connection = null;
        serverQueue.playing = false;
        let globalMusicEmbedId = await getGlobalMusicEmbed(interaction.guild.id);
        if (globalMusicEmbedId) {
            const globalMusicEmbed = await serverQueue.textChannel.messages.fetch(globalMusicEmbedId);
            const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('/music play เพื่อเล่นเพลง /music stop เพื่อหยุดเล่นเพลง')
            .setDescription(`ไม่มีเพลง`) 
            .addFields(
                { name: 'ระยะเวลา', value: '-', inline: true },
                { name: 'ขอโดย', value: '-', inline: true },
            )
            .setImage(null)
            .setTimestamp(new Date());
        await globalMusicEmbed.edit({ embeds: [embed] });
        }
        await interaction.reply({ content: 'หยุดเล่นเพลงและออกจากห้องเสียงแล้ว', ephemeral: true });
    } else {
        await interaction.reply({ content: 'Bot ไม่ได้อยู่ในห้องเสียง', ephemeral: true });
    }
}

async function handleQueue(interaction) {
    const serverQueue = getServerQueue(interaction.guild.id);
    if (!serverQueue || serverQueue.songs.length === 0) {
        return interaction.reply({ content: 'ไม่มีเพลงในคิว', ephemeral: true });
    }

    const currentSong = serverQueue.songs[0];
    // แก้ไขการเรียกใช้ updateOrSendEmbed ที่นี่
    await updateOrSendEmbed(interaction.channel, currentSong, serverQueue.songs.slice(1), interaction.guild.id);
    await interaction.reply({ content: 'อัปเดตคิวเพลงแล้ว', ephemeral: true });
}

const data = new SlashCommandBuilder()
    .setName('music')
    .setDescription('คำสั่งเกี่ยวกับการเล่นเพลง')
    .addSubcommand(subcommand =>
        subcommand
            .setName('play')
            .setDescription('เล่นเพลงจาก YouTube')
            .addStringOption(option =>
                option.setName('query')
                    .setDescription('ชื่อเพลงหรือ URL ของ YouTube')
                    .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('stop')
            .setDescription('หยุดเล่นเพลงและออกจากห้องเสียง'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('queue')
            .setDescription('แสดงคิวเพลงปัจจุบัน'));

async function run({ interaction }) {
    if (interaction.channelId !== rq_ch) {
        return interaction.reply({ content: 'ไม่สามารถขอเพลงในห้องนี้ได้ [กรุณาเข้าไปขอในห้องขอเพลงของbot]', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    

    if (subcommand === 'play') {
        await handlePlay(interaction);
    } else if (subcommand === 'stop') {
        await handleStop(interaction);
    } else if (subcommand === 'queue') {
        await handleQueue(interaction);
    }
}

module.exports = { data, run };