// const { EmbedBuilder, Client } = require('discord.js');
// const config = require('../../../config/config_id_channel.json');

// module.exports = async (client) => {
//     const channel = client.channels.cache.get(config.id_minecraft);
//     if (!channel) return;

//     const embed = new EmbedBuilder()
//         .setTitle('🌍 Server Minecraft (JAVA) Information')
//         .setThumbnail('https://i.imgur.com/eBzBmxb.png');

//     const message = await channel.send({ embeds: [embed] });
//     const ip = 'chanakun428.thddns.net:8000';
//     const getStatus = async () => {
//         const { online, ip_address, port, version, players, motd } = await (await fetch(`https://api.mcstatus.io/v2/status/java/${ip}`)).json();
//         const now = new Date();
//         const [formattedDate, formattedTime] = [new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'long', day: '2-digit' }).format(now), new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)];
//         const status = online ? '🟢 | ONLINE' : '🔴 | OFFLINE';
//         const playerCount = `\`${online ? `${players.online} / ${players.max}` : '-'}\``;
//         const version_ = online ? version.name_clean : '-';
//         const motd_ = online ? motd.clean : '-';
//         embed.setColor(online ? 'Green' : 'Red').setFields(
//             { name: '🛈 Status', value: `\`${status}\``, inline: true },
//             { name: '🌐 IP', value: `\`${ip_address}\``, inline: true },
//             { name: '🔌 PORT', value: `\`${port}\``, inline: true },
//             { name: '💻 Versions', value: `\`${version_}\``, inline: true },
//             { name: '👥 Players', value: playerCount, inline: true },
//             { name: '📜 Motd', value: `\`${motd_}\``, inline: false },
//             { name: '\u200B', value: ' ' },
//             { name: `👷 Created by: \`${'_nv23'}\``, value: ' ' },
//             { name: '⏰ Last Update', value: `${formattedDate} | ${formattedTime}` }
//         );
//         await message.edit({ embeds: [embed] });
//     };
// // เริ่มจับเวลา
//     setInterval(getStatus, 2000);
// };