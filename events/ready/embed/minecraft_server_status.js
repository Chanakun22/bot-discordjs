const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');
const config = require('../../../config/config_id_channel.json')


module.exports = async (client) => {

    const channel = await client.channels.cache.get(config.id_minecraft);


    const embed = new EmbedBuilder()
        .setTitle('Server Minecraft (JAVA) Information')
        .setColor('#ff0000')
        .setThumbnail('https://i.imgur.com/eBzBmxb.png')

    const message = await channel.send({ embeds: [embed] });

    let ip = 'chanakun428.thddns.net:8000';
    let intervalId = setInterval(async () => {
        try {
            var statusmineserver = await fetch(`https://api.mcstatus.io/v2/status/java/${ip}`)
            var status_ser = await statusmineserver.json()
            // console.log(status_ser)
            const now = await new Date();
            // 
            // Specify date options for formatting
            const dateOptions = {
                year: 'numeric',    // "numeric" for year (e.g., 2024)
                month: 'long',      // "long" for full month name (e.g., January)
                day: '2-digit'      // "2-digit" for zero-padded day of the month (e.g., 01)
            };

            // Specify time options for formatting
            const timeOptions = {
                hour: '2-digit',    // "2-digit" for zero-padded hour (e.g., 01, 02, ..., 12)
                minute: '2-digit',  // "2-digit" for zero-padded minute (e.g., 00, 01, ..., 59)
                second: '2-digit',  // "2-digit" for zero-padded second (e.g., 00, 01, ..., 59)
                hour12: false       // Use 24-hour format (e.g., 13:00 instead of 1:00 PM)
            };

            // Format the date and time separately
            const dateFormatter = await new Intl.DateTimeFormat('th-TH', dateOptions);
            const timeFormatter = await new Intl.DateTimeFormat('th-TH', timeOptions);

            const formattedDate = dateFormatter.format(now); // Format date
            const formattedTime = timeFormatter.format(now); // Format time

            if (!status_ser.online) {
                var status_ = await status_ser.online ? '🟢 | ONLINE' : '🔴 | OFFLINE'
                var ser_ip = await status_ser.ip_address
                var ser_port = await status_ser.port
                var ser_vers = '-'
                var players_count = `\`${'-'}\``
                var ser_name = '-'
            }
            else {
                var status_ = await status_ser.online ? '🟢 | ONLINE' : '🔴 | OFFLINE'
                var ser_ip = await status_ser.ip_address
                var ser_port = await status_ser.port
                var ser_vers = await status_ser.version.name_clean
                var players_count = await (`\`${status_ser.players.online} / ${status_ser.players.max}\``)
                var ser_name = await status_ser.motd.clean
            }

            if (status_ser.online) {
                await embed.setColor('Green')
            }
            else {
                await embed.setColor('Red')
            }


            await embed.setFields(
                { name: `Status`, value: `\`${status_}\``, inline: true },
                { name: 'IP', value: `\`${ser_ip}\``, inline: true },
                { name: 'PORT', value: `\`${ser_port}\``, inline: true },
                { name: 'Versions', value: `\`${ser_vers}\``, inline: true },
                { name: 'Players', value: `${players_count}`, inline: true },
                // { name: 'Motd', value: `\`${ser_name}\``,inline: false},
                // { name: 'Players list', value: `${status_ser.players.list.name_clean}`},
                { name: '\u200B', value: ` ` },
                // { name: '\u200B', value: ` ` },
                // { name: '\u200B', value: ` ` },
                { name: `Created by: \`${'_nv23'}\``, value: ' ' },
                { name: 'Last Update', value: `${formattedDate} | ${formattedTime}` }
            )
            await message.edit({ embeds: [embed] });
        }
        catch (error) {
            console.error(error)
        }
    }, 40000);



}