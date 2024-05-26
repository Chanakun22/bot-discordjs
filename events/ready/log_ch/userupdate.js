const { voiceStateUpdate, SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');

module.exports = async (client) => {
    client.on('guildMemberUpdate', (oldMember, newMember) => {
        if(oldMember.nickname || newMember.nickname){
        console.log(`User before update: ${oldMember.nickname}`);
        console.log(`User after update: ${newMember.nickname}`);
        }
        // console.log(oldMember)
        // console.log(`User after  update: ${newMember.us}`);
    });
    
}