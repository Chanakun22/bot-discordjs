const {EmbedBuilder} = require('discord.js');
const config = require('../../../config/config_id_channel.json')

let onlineMemberCount_lasted = 0;

module.exports = async (client) => {
  const channel = await client.channels.cache.get(config.id_embed_status);
  const deletemessage = await channel.messages.fetch({ limit: 4 });
  await deletemessage.forEach(async deletemessage => {
    await deletemessage.delete();
  });
  const embed = new EmbedBuilder()
    .setTitle('Server Information')
    .setDescription('Update Server Information every 30 sec')
    .setColor('#ff0000');
  const message = await channel.send({ embeds: [embed] });
  const guild = client.guilds.cache.get('1169260319823106169');
  let intervalId = setInterval(async () => {
    try {
      let totalMembers = await guild.members.cache.size;
      let totalUsers = await guild.members.cache.filter(member => !member.user.bot).size;
      let totalBots = await guild.members.cache.filter(member => member.user.bot).size;
      let onlineMembers = await guild.members.cache.filter(m => m.presence?.status === 'online').size;
      let dndMembers = await guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
      let idleMembers = await guild.members.cache.filter(m => m.presence?.status === 'idle').size;
      let offlineMembers = await guild.members.cache.filter(m => m.presence?.status === 'offline' || !m.presence).size;
      let onlineMemberCount = await onlineMembers + dndMembers + idleMembers;
      // Get current date and time
      if (onlineMemberCount_lasted != onlineMemberCount) {
        const now = new Date();
        const dateOptions = {
          year: 'numeric',    // "numeric" for year (e.g., 2024)
          month: 'long',      // "long" for full month name (e.g., January)
          day: '2-digit'      // "2-digit" for zero-padded day of the month (e.g., 01)
        };
        const timeOptions = {
          hour: '2-digit',    // "2-digit" for zero-padded hour (e.g., 01, 02, ..., 12)
          minute: '2-digit',  // "2-digit" for zero-padded minute (e.g., 00, 01, ..., 59)
          second: '2-digit',  // "2-digit" for zero-padded second (e.g., 00, 01, ..., 59)
          hour12: false       // Use 24-hour format (e.g., 13:00 instead of 1:00 PM)
        };
        // Format the date and time separately
        const dateFormatter = new Intl.DateTimeFormat('th-TH', dateOptions);
        const timeFormatter = new Intl.DateTimeFormat('th-TH', timeOptions);
        const formattedDate = dateFormatter.format(now); // Format date
        const formattedTime = timeFormatter.format(now); // Format time
        await embed.setColor('Random')
        await embed.setFields(
          { name: 'total user', value: `👥  ${totalMembers.toString()}` },
          { name: 'total member', value: `🧑  ${totalUsers.toString()}` },
          { name: 'total bot', value: `🤖  ${totalBots.toString()}` },
          { name: 'member online status', value: `🟢  ${onlineMembers.toString()}` },
          { name: 'member dnd status', value: `🚫  ${dndMembers.toString()}` },
          { name: 'member idle status', value: `🌙  ${idleMembers.toString()}` },
          { name: 'member offline status', value: `⚫  ${offlineMembers.toString()}` },
          { name: 'member online now', value: `📶  ${onlineMemberCount.toString() - 3}` },
          { name: ' ', value: ` ` },
          { name: 'Text Channels', value: `#️⃣${guild.channels.cache.filter((c) => c.type === 0).toJSON().length - 3}`, inline: true },
          { name: 'Voice Channels', value: `🔊${guild.channels.cache.filter((c) => c.type === 2).toJSON().length}`, inline: true },
          { name: '\u200B', value: ` ` },
          // { name: 'Created by', value: '_nv23' },
          { name: 'Last Update', value: `${formattedDate} | ${formattedTime}` }
        )
        // embed.setTimestamp()
        embed.setFooter({text : `_nv23`})
        await message.edit({ embeds: [embed] });
        onlineMemberCount_lasted = onlineMemberCount;
      }
    }
    catch (error) {
      console.log(error)
    }
  }, 1000);



}