// const { SlashCommandAssertions, ContextMenuCommandAssertions, ContextMenuCommandBuilder, SlashCommandBuilder } = require("discord.js");

// const data = new SlashCommandBuilder()
//     .setName('ping')
//     .setDescription('for check bot !')

// async function run({ interaction }) {
//     try {
//         if (!interaction.guild) {
//             await interaction.reply({
//                 content: 'You can only run this command inside a server.',
//                 ephemeral: true // Send a private response visible only to the user
//             });
//             return;
//         }
//         await interaction.reply('pinging...');
//         await interaction.editReply(`Pong`);
//     } catch (error) {
//         console.error('[checkbot]', error);
//     }

// }
// module.exports = { data, run }