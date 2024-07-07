const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');
const config = require('../../../config/config_id_channel.json');

let daydif = 0;
let mem_count = 0;

module.exports = async (client) => {
    try {
        const guild = client.guilds.cache.get('1169260319823106169');

        async function date_() {
            const now = new Date();
            const dateOptions = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            };
            const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
            const formattedDate = dateFormatter.format(now);
            await client.channels.cache.get(config.id_change_name_date_ch).setName(`📆${formattedDate}`);
        }

        function withTimeout(promise, timeout) {
            return Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('หมดเวลา')), timeout)
                )
            ]);
        }

        setInterval(async () => {
            try {
                const now = new Date();
                const dateOptions = {
                    day: '2-digit'
                };
                const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
                const formattedDate = dateFormatter.format(now);
                const members = await withTimeout(guild.members.fetch(), 60000);
                const onlineMemberCount = members.filter(m => !m.user.bot && ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;

                if (formattedDate != daydif) {
                    daydif = formattedDate;
                    setTimeout(() => {
                        date_();
                        console.log('[newstatus_ch]', daydif);
                    }, 60000);
                }

                if (onlineMemberCount != mem_count) {
                    mem_count = onlineMemberCount;
                    setTimeout(async () => {
                        await client.channels.cache.get(config.id_change_name_memcount_ch).setName(`🟢 ${onlineMemberCount}`);
                        console.log('[newstatus_ch]', mem_count);
                    }, 60000);
                }
            } catch (error) {
                if (error.message === 'หมดเวลา') {
                    console.error('การดึงข้อมูลสมาชิกใช้เวลานานเกินไป');
                } else {
                    console.error('เกิดข้อผิดพลาด:', error);
                }
            }
        }, 1000);
    } catch (error) {
        console.error(`voice channle setname Eror : ${error}`);
    }
}
