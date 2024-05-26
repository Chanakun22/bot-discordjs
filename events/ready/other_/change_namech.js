// const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');

// /**
//  * 
//  * @param {*} client 
//  */
// module.exports = async (client) => {
//     setInterval(async () => {
//         try{
//         const now = await new Date();
//         const dateOptions = {
//             year: "numeric", // "numeric" for year (e.g., 2024)
//             month: "long", // "long" for full month name (e.g., January)
//             day: "2-digit", // "2-digit" for zero-padded day of the month (e.g., 01)
//         };
//         const timeOptions = {
//             hour: "2-digit", // "2-digit" for zero-padded hour (e.g., 01, 02, ..., 12)
//             minute: "2-digit", // "2-digit" for zero-padded minute (e.g., 00, 01, ..., 59)
//             second: "2-digit", // "2-digit" for zero-padded second (e.g., 00, 01, ..., 59)
//             hour12: false, // Use 24-hour format (e.g., 13:00 instead of 1:00 PM)
//         };
//         const dateFormatter = await new Intl.DateTimeFormat("th-TH", dateOptions);
//         const timeFormatter = await new Intl.DateTimeFormat("th-TH", timeOptions);
//         const formattedDate = dateFormatter.format(now); // Format date
//         const formattedTime = timeFormatter.format(now); // Format time
//         const server_status = await fetch(`https://api.mcstatus.io/v2/status/java/chanakun428.thddns.net:8000`)
//         const ser = await server_status.json()
//         var status = ser.online ? '🟢server-game-information' : '🔴server-game-information'
//         await client.channels.cache.get('1238456510514728981').setName(`${status}`)
//     }
//     catch(error){
//         console.error(error)
//     }
//     },60000)

// }

// // 