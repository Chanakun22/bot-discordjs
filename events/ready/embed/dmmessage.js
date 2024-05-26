const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');
module.exports = async (client) => {
    const now = await new Date();

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
    const dateFormatter = await new Intl.DateTimeFormat('th-TH', dateOptions);
    const timeFormatter = await new Intl.DateTimeFormat('th-TH', timeOptions);
    const formattedDate = dateFormatter.format(now); // Format date
    const formattedTime = timeFormatter.format(now); // Format time
    const embed = new EmbedBuilder()
        .setTitle('Start')
        .setColor('Green')
        .setDescription(`เริ่ม ตอน ${formattedDate} | ${formattedTime}`)

    const userId = '815865712181641236';
    const user = await client.users.fetch(userId);
    user.send({ embeds: [embed] });

}