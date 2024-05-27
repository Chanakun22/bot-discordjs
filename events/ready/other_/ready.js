const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;
module.exports = async (client, interaction) => {
  console.clear()
  console.log(`${client.user.tag} is Ready`);
  // ตรวจสอบว่ามี mongoURL ใน environment variables หรือไม่
  if (!mongoURL) {
    console.log('MongoDB URL not provided. Please set the mongoURL in your environment variables.');
    return;
  }

  // เชื่อมต่อกับ MongoDB โดยไม่ใช้ตัวเลือกที่ถูกทำให้เป็น deprecated
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to database');
  } catch (error) {
    console.error('Could not connect to database:', error);
    return;
  }

  // ตั้งค่าสถานะของบอท
  client.user.setPresence({
    activities: [{ name: `Time: `, type: ActivityType.Watching }],
    status: 'dnd',
  });

  // อัปเดตสถานะของบอททุก 10 นาที
  setInterval(async () => {
    const now = await new Date();
    // 
    // Specify date options for formatting
    const dateOptions = {
      year: 'numeric',    // "numeric" for year (e.g., 2024)
      month: 'long',      // "long" for full month name (e.g., January)
      day: '2-digit'      // "2-digit" for zero-padded day of the month (e.g., 01)
    };

    // Specify time options for formatting
    const timeOptions = {
      hour: '2-digit',    // "2-digit" for zero-padded hour (e.g., 01, 02, ..., 12)
      minute: '2-digit',  // "2-digit" for zero-padded minute (e.g., 00, 01, ..., 59)
      second: '2-digit',  // "2-digit" for zero-padded second (e.g., 00, 01, ..., 59)
      hour12: false       // Use 24-hour format (e.g., 13:00 instead of 1:00 PM)
    };

    // Format the date and time separately
    const dateFormatter = await new Intl.DateTimeFormat('th-TH', dateOptions);
    const timeFormatter = await new Intl.DateTimeFormat('th-TH', timeOptions);

    const formattedDate = dateFormatter.format(now); // Format date
    const formattedTime = timeFormatter.format(now); // Format time
    client.user.setPresence({
      activities: [{ name: `⏰: ${formattedTime}`, type: ActivityType.Watching }],
      status: 'dnd',
    });
  }, 3000);
};
