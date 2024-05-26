const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');

const config = require('../../../config/config_id_channel.json')
/**
 * 
 * @param {*} client 
 */

let daydif = 0
let mem_count = 0


module.exports = async (client) => {
    try {
        const guild = client.guilds.cache.get('1169260319823106169');

        async function date_() {
            const now = new Date();
            const dateOptions = {
                year: 'numeric',    // "numeric" for year (e.g., 2024)
                month: 'long',      // "long" for full month name (e.g., January)
                day: '2-digit'      // "2-digit" for zero-padded day of the month (e.g., 01)
            };
            const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
            const formattedDate = dateFormatter.format(now); // Format date
            await client.channels.cache.get(config.id_change_name_date_ch).setName(`📆${formattedDate}`)
        }

        async function count_member() {
            let onlineMembers = await guild.members.cache.filter(m => m.presence?.status === 'online').size;
            let dndMembers = await guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
            let idleMembers = await guild.members.cache.filter(m => m.presence?.status === 'idle').size;
            let onlineMemberCount = await onlineMembers + dndMembers + idleMembers;
            await client.channels.cache.get(config.id_change_name_memcount_ch).setName(`🟢 ${onlineMemberCount - 3}`)
        }


        setInterval(async () => {
            const now = new Date();
            const dateOptions = {
                day: '2-digit'
            }
            const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
            const formattedDate = dateFormatter.format(now);
            let onlineMembers = await guild.members.cache.filter(m => m.presence?.status === 'online').size;
            let dndMembers = await guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
            let idleMembers = await guild.members.cache.filter(m => m.presence?.status === 'idle').size;
            let onlineMemberCount = await onlineMembers + dndMembers + idleMembers;
            ///////สิ้นสุดการกำหนดตัวเเป///////
            if (formattedDate != daydif) {
                daydif = formattedDate
                date_()
            } 
            if (onlineMemberCount != mem_count) {
                mem_count = onlineMemberCount   
                count_member()
            }

        }, 20000)
    }
    catch (error) {
        console.error(`voice channle setname Eror : ${error}`)
    }
}

// 