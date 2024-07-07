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

// ฟังก์ชันช่วยเหลือสำหรับการรับอิโมจิตามสถานะ
function getStatusEmoji(status) {
  switch (status) {
    case 'online': return '🟢';
    case 'idle': return '🌙';
    case 'dnd': return '🔴';
    case 'offline': return '⚫';
    default: return '❓';
  }
}

// ฟังก์ชันสำหรับตั้งค่า timeout สำหรับ promise
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('หมดเวลา')), timeout)
    )
  ]);
}

module.exports = async (client) => {
  const channel = await client.channels.cache.get(config.id_embed_status);

  if (!channel) {
    console.error('ไม่พบช่อง');
    return;
  }

  const messages = await channel.messages.fetch({ limit: 4 });
  await Promise.all(messages.map(message => message.delete()));

  const embed = new EmbedBuilder()
    .setTitle('ข้อมูลเซิร์ฟเวอร์')
    .setColor('Red');

  const message = await channel.send({ embeds: [embed] });
  const guild = client.guilds.cache.get('1169260319823106169');

  if (!guild) {
    console.error('ไม่พบเซิร์ฟเวอร์');
    return;
  }

  setInterval(async () => {
    try {
      const members = await withTimeout(guild.members.fetch(), 1000); // หมดเวลาใน 60 วินาที
      changedUsers = []; // รีเซ็ตรายการผู้ใช้ที่มีการเปลี่ยนแปลงในแต่ละช่วงเวลา

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

      statusCounts.active = members.filter(m => !m.user.bot && ['online', 'dnd', 'idle'].includes(m.presence?.status)).size;

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
        const maxChangesToShow = 3; // จำกัดจำนวนการเปลี่ยนแปลงที่จะแสดง
        changedUsers.slice(0, maxChangesToShow).forEach(user => {
          const oldEmoji = getStatusEmoji(user.oldStatus);
          const newEmoji = getStatusEmoji(user.newStatus);
          statusChangesText += `**${user.username}**: ${oldEmoji} ${user.oldStatus} -> ${newEmoji} ${user.newStatus}\n`;
        });
        if (changedUsers.length > maxChangesToShow) {
          statusChangesText += `และอีก **${changedUsers.length - maxChangesToShow}** การเปลี่ยนแปลง\n`;
        }

        embed.setColor('Random').setFields(
          { name: 'ผู้ใช้ทั้งหมด', value: `👥  ${statusCounts.total}`, inline: false },
          { name: 'สมาชิกทั้งหมด', value: `🧑  ${statusCounts.users}`, inline: false },
          { name: 'บอททั้งหมด', value: `🤖  ${statusCounts.bots}`, inline: false },
          { name: 'สมาชิกที่ออนไลน์', value: `🟢  ${statusCounts.online}`, inline: false },
          { name: 'สมาชิกที่ห้ามรบกวน', value: `🚫  ${statusCounts.dnd}`, inline: false },
          { name: 'สมาชิกที่ไม่อยู่', value: `🌙  ${statusCounts.idle}`, inline: false },
          { name: 'สมาชิกที่ออฟไลน์', value: `⚫  ${statusCounts.offline}`, inline: false },
          { name: 'สมาชิกที่ใช้งาน', value: `📶  ${statusCounts.active}`, inline: false },
          { name: 'ช่องข้อความ', value: `#️⃣ ${guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size}`, inline: true },
          { name: 'ช่องเสียง', value: `🔊 ${guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}`, inline: true },
          { name: 'การเปลี่ยนแปลงสถานะล่าสุด', value: statusChangesText || 'ไม่มีการเปลี่ยนแปลงล่าสุด', inline: false }
        ).setFooter({ text: 'อัปเดตข้อมูลเซิร์ฟเวอร์ทุกการเปลี่ยนแปลงสถานะ' }).setTimestamp();

        await message.edit({ embeds: [embed] });
        lastStatusCounts = statusCounts;
      }
    } catch (error) {
      if (error.message === 'หมดเวลา') {
        console.error('การดึงข้อมูลสมาชิกใช้เวลานานเกินไป');
      } else {
        console.error(error);
      }
    }
  }, 3000);
};
