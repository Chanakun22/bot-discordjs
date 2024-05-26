const { voiceStateUpdate, SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');
const config = require('../../../config/config_id_channel.json')

module.exports = async (client) => {
    client.on('messageDelete', async message => {
        if (!message.partial && !message.author.bot) {
            // สร้าง embed
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setColor('Yellow') // สีขอบ embed
                .setTitle('⚠️Deleted Message')
                .setDescription(`A message by <@${message.author.id}> was deleted from <#${message.channel.id}>.`) // เพิ่มชื่อช่องที่นี่
                .addFields(
                    { name: 'Channel', value: message.channel.name }, // แสดงชื่อช่อง
                    { name: 'Content', value: message.content ? `📌 \`${message.content}\`` : 'No content' } // แสดงเนื้อหาข้อความ
                )
                .setTimestamp(message.createdAt)
                .setFooter({ text: 'Message deletion log' });

            // ส่ง embed ไปยัง log channel
            const logChannel = client.channels.cache.get(config.id_log_delete_mes); // แทนที่ด้วย ID ของ log channel ของคุณ
            if (logChannel) {
                logChannel.send({ embeds: [embed] });
            }
        }
    });
};


