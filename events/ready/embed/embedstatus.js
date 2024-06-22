const { EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../../../config/config_id_channel.json');

let lastStatusCounts = {
  online: 0,
  dnd: 0,
  idle: 0,
  offline: 0
};

let userStatus = {};
let changedUsers = [];

function getStatusEmoji(status) {
  switch (status) {
    case 'online': return '🟢';
    case 'idle': return '🌙';
    case 'dnd': return '🔴';
    case 'offline': return '⚫';
    default: return '❓';
  }
}

module.exports = async (client) => {
  const channel = await client.channels.cache.get(config.id_embed_status);

  if (!channel) {
    console.error('Channel not found');
    return;
  }

  const messages = await channel.messages.fetch({ limit: 4 });
  await Promise.all(messages.map(message => message.delete()));

  const embed = new EmbedBuilder()
    .setTitle('Server Information')
    .setColor('Red');

  const message = await channel.send({ embeds: [embed] });
  const guild = client.guilds.cache.get('1169260319823106169');

  if (!guild) {
    console.error('Guild not found');
    return;
  }

  setInterval(async () => {
    try {
      const members = await guild.members.fetch();
      changedUsers = []; // รีเซ็ตรายชื่อผู้ใช้ที่เปลี่ยนแปลงในแต่ละรอบ

      const statusCounts = {
        total: members.size,
        users: members.filter(m => !m.user.bot).size,
        bots: members.filter(m => m.user.bot).size,
        online: members.filter(m => m.presence?.status === 'online').size,
        dnd: members.filter(m => m.presence?.status === 'dnd').size,
        idle: members.filter(m => m.presence?.status === 'idle').size,
        offline: members.filter(m => !m.presence || m.presence.status === 'offline').size,
        active: 0
      };

      statusCounts.active = statusCounts.online + statusCounts.dnd + statusCounts.idle - members.filter(m => m.user.bot && m.presence?.status !== 'offline').size;

      // อัปเดต userStatus และตรวจสอบการเปลี่ยนแปลง
      members.forEach(member => {
        const username = String(member.user.username);
        const currentStatus = member.presence ? member.presence.status : 'offline';

        if (userStatus[username] !== currentStatus) {
          changedUsers.push({
            username: username,
            oldStatus: userStatus[username] || 'unknown',
            newStatus: currentStatus
          });
        }

        userStatus[username] = currentStatus;
      });

      if (Object.keys(lastStatusCounts).some(key => lastStatusCounts[key] !== statusCounts[key])) {
        const now = new Date();
        // สร้างข้อความสำหรับการเปลี่ยนแปลงสถานะ
        let statusChangesText = '';
        const maxChangesToShow = 3; // จำกัดจำนวนการเปลี่ยนแปลงที่แสดง
        changedUsers.slice(0, maxChangesToShow).forEach(user => {
          const oldEmoji = getStatusEmoji(user.oldStatus);
          const newEmoji = getStatusEmoji(user.newStatus);
          statusChangesText += `**${user.username}**: ${oldEmoji} ${user.oldStatus} -> ${newEmoji} ${user.newStatus}\n`;
        });
        if (changedUsers.length > maxChangesToShow) {
          statusChangesText += `และอีก **${changedUsers.length - maxChangesToShow}** การเปลี่ยนแปลง\n`;
        }

        embed.setColor('Random').setFields(
          { name: 'Total Users', value: `👥  ${statusCounts.total}`, inline: false },
          { name: 'Total Members', value: `🧑  ${statusCounts.users}`, inline: false },
          { name: 'Total Bots', value: `🤖  ${statusCounts.bots}`, inline: false },
          { name: 'Online Members', value: `🟢  ${statusCounts.online}`, inline: false },
          { name: 'DND Members', value: `🚫  ${statusCounts.dnd}`, inline: false },
          { name: 'Idle Members', value: `🌙  ${statusCounts.idle}`, inline: false },
          { name: 'Offline Members', value: `⚫  ${statusCounts.offline}`, inline: false },
          { name: 'Active Members', value: `📶  ${statusCounts.active}`, inline: false },
          { name: 'Text Channels', value: `#️⃣ ${guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size}`, inline: true },
          { name: 'Voice Channels', value: `🔊 ${guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}`, inline: true },
          { name: 'Recent Status Changes', value: statusChangesText || 'No recent changes', inline: false }
        ).setFooter({ text: 'Update Server information every status change' }).setTimestamp();

        await message.edit({ embeds: [embed] });
        lastStatusCounts = statusCounts;
      }
    } catch (error) {
      console.error(error);
    }
  }, 1000);
};