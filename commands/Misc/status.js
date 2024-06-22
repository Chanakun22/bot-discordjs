const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction } = require('discord.js');

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */


module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.'),
    run: async ({ interaction, client }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "You can only run this Command inside a server",
                ephemeral: true,
            });
            return true
        }
        else {
            interaction.reply({
                content: "Server information ",
                ephemeral: true,
            });

        }

        const guild = client.guilds.cache.get('1169260319823106169');
        const serverEmbed = new EmbedBuilder({
            author: { name: guild.name, iconURL: guild.iconURL({ size: 256 }) },
            Title: ('Server Information'),
        })
        const message = await interaction.channel.send({ embeds: [serverEmbed] });
        try {
            let intervalId = setInterval(async () => {
                let totalMembers = await guild.members.cache.size;
                let totalUsers = await guild.members.cache.filter(member => !member.user.bot).size;
                let totalBots = await guild.members.cache.filter(member => member.user.bot).size;
                let onlineMembers = await guild.members.cache.filter(m => m.presence?.status === 'online').size;
                let dndMembers = await guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
                let idleMembers = await guild.members.cache.filter(m => m.presence?.status === 'idle').size;
                let offlineMembers = await guild.members.cache.filter(m => m.presence?.status === 'offline' || !m.presence).size;
                let onlineMemberCount = await onlineMembers + dndMembers + idleMembers - totalBots;
                serverEmbed.setColor('Random')
                await serverEmbed.setFields(
                    { name: 'total user', value: `👥  ${totalMembers.toString()}` },
                    { name: 'total member', value: `🧑  ${totalUsers.toString()}` },
                    { name: 'total bot', value: `🤖  ${totalBots.toString()}` },
                    { name: 'member online status', value: `🟢  ${onlineMembers.toString()}` },
                    { name: 'member dnd status', value: `🚫  ${dndMembers.toString()}` },
                    { name: 'member idle status', value: `🌙  ${idleMembers.toString()}` },
                    { name: 'member offline status', value: `⚫  ${offlineMembers.toString()}` },
                    { name: 'member online now', value: `📶  ${onlineMemberCount.toString()}` },
                    { name: ' ', value: ` ` },
                    { name: 'Text Channels', value: `#️⃣${guild.channels.cache.filter((c) => c.type === 0).toJSON().length - 3}`, inline: true },
                    { name: 'Voice Channels', value: `🔊${guild.channels.cache.filter((c) => c.type === 2).toJSON().length}`, inline: true },
                    { name: '\u200B', value: ` ` },
                    { name: 'Created by', value: '_nv23' },
                    { name: 'Last Update', value: new Date().toLocaleString() }

                )
                await message.edit({ embeds: [serverEmbed] });
            }, 60000);
        } catch (error) {
            console.log(error);
        }
        // interaction.client.on('messageDelete', () => clearInterval(intervalId));
        // interaction.client.on('shardDisconnect', () => clearInterval(intervalId));
        // // interaction.client.on('shardReconnecting', () => clearInterval(intervalId));
        // interaction.client.on('shardResume', () => clearInterval(intervalId));
    },
    option: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    }
};
