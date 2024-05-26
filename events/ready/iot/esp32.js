// const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');

// module.exports = async (client) => {
//     const channel = await client.channels.cache.get('1230150236543127614');
//     const deletemessage = await channel.messages.fetch({ limit: 1 });
//     await deletemessage.forEach(async deletemessage => {
//         await deletemessage.delete();
//     });
//     const embed = new EmbedBuilder()
//         .setTitle("Home")
//         .setDescription('Test API ESP32 & ESP8266')
//         .setColor("#ff0000")
//     const message = await channel.send({ embeds: [embed] });
//     // สร้างตัวแปลงรูปแบบวันที่และเวลา
//     const dateOptions = { year: "numeric", month: "long", day: "2-digit" };
//     const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
//     let dateFormatter = new Intl.DateTimeFormat("th-TH", dateOptions);
//     let timeFormatter = new Intl.DateTimeFormat("th-TH", timeOptions);

//     setInterval(async () => {
//         try {
//             var ser = await fetch('http://chanakun428.thddns.net:8003/')
//             if (!ser.ok) {
//                 throw new Error(`HTTP error! Status: ${ser.status}`);
//             }
//             var data_ser = await ser.json()
//             const now = new Date();
//             let formattedDate = dateFormatter.format(now);
//             let formattedTime = timeFormatter.format(now);
//             let voltage = data_ser.Sen.voltage
//             let fixed_voltage = parseFloat(voltage.toFixed(2));
//             var current = data_ser.Sen.current
//             let fixed_current = parseFloat(current.toFixed(2));
//             var power = data_ser.Sen.power
//             let fixed_power = parseFloat(power.toFixed(2));
//             var energy = data_ser.Sen.energy
//             let fixed_energy = parseFloat(energy.toFixed(2));
//             var frequency = data_ser.Sen.frequency
//             let fixed_frequency = parseFloat(frequency.toFixed(2));
//             var pf = data_ser.Sen.pf
//             let fixed_pf = parseFloat(pf.toFixed(2));

//             embed.setColor('Green')
//                 .setFields(
//                     { name: `voltage`, value: `\`${fixed_voltage}\` V`, inline: true },
//                     { name: "current", value: `\`${fixed_current}\` A`, inline: true },
//                     { name: "power", value: `\`${fixed_power}\` W`, inline: true },
//                     { name: "energy", value: `\`${fixed_energy}\` kWh`, inline: true },
//                     { name: "frequency", value: `\`${fixed_frequency}\` Hz`, inline: true },
//                     { name: "pf", value: `\`${fixed_pf}\``, inline: true },
//                     { name: "\u200B", value: ` ` },
//                     { name: `Created by: \`${"_nv23"}\``, value: " " },
//                     { name: "Last Update", value: `${formattedDate} | ${formattedTime}` }
//                 );
//             await message.edit({ embeds: [embed] });
//         }
//         catch (error) {
//             console.error('Error fetching sensor data:', error.message);
//             embed.setColor('Red')
//                 .setFields(
//                     { name: "Error", value: "Failed to fetch sensor data. Please check the server." }
//                 );
//             await message.edit({ embeds: [embed] });
//         }
//     }, 3000);
// }
