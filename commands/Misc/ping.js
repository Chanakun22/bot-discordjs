const { SlashCommandAssertions, ContextMenuCommandAssertions, ContextMenuCommandBuilder, SlashCommandBuilder } = require("discord.js");



const data = new SlashCommandBuilder()
    .setName('pinge')
    .setDescription('find from thsi list')

async function run({ interaction }) {
    try {
        if (!interaction.guild) {
            await interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true // Send a private response visible only to the user
            });
            return;
        }

        const startTime = Date.now();
        await interaction.reply('Pinging...');

        const endTime = Date.now();
        const ping = endTime - startTime;

        await interaction.editReply(`Ping : ${ping}ms`);
    } catch (error) {
        console.error('Error executing ping command:', error);
        await interaction.reply('There was an error while executing the ping command.');
    }

}
module.exports = { data, run }