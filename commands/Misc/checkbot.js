const { SlashCommandAssertions, ContextMenuCommandAssertions, ContextMenuCommandBuilder, SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName('checkbot')
    .setDescription('for check bot !')

async function run({ interaction }) {
    try {
        if (!interaction.guild) {
            await interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true // Send a private response visible only to the user
            });
            return;
        }
        await interaction.reply({content: 'im alive in Server', ephemeral: true});
        await interaction.editReply(`im alive in Server`);
    } catch (error) {
        console.error('[checkbot]', error);
    }

}
module.exports = { data, run }

