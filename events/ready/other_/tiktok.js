// const puppeteer = require('puppeteer');
// const { SlashCommandBuilder, EmbedBuilder, Client, ContextMenuCommandInteraction, CommandInteraction, ActivityType } = require('discord.js');

// async function getTikTokProfileData(username) {
//     var url = (`https://www.tiktok.com/@${username}`)
//     var ch_img = ('//*[@id="main-content-others_homepage"]/div/div[1]/div[1]/div[1]/span/img')
//     var ch_name = ('//*[@id="main-content-others_homepage"]/div/div[1]/div[1]/div[2]/h1')
//     var ch_following = ('//*[@id="main-content-others_homepage"]/div/div[1]/h3/div[1]/strong')
//     var ch_follower = ('//*[@id="main-content-others_homepage"]/div/div[1]/h3/div[2]/strong')
//     var ch_likes = ('//*[@id="main-content-others_homepage"]/div/div[1]/h3/div[3]/strong')
//     var ch_video = ('//*[@id="main-content-others_homepage"]/div/div[2]/div[2]/div/div[3]/div[1]/div/div/a/div/div[1]/div/span/picture/img')
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage()
//     await page.goto(url);
//     let chname = await page.evaluate((ch_name) => {
//         let element = document.evaluate(ch_name, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         return element ? element.textContent : '';
//     }, ch_name);

//     let following = await page.evaluate((ch_following) => {
//         let element = document.evaluate(ch_following, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         return element ? element.textContent : '';
//     }, ch_following);

//     let img = await page.evaluate((ch_img) => {
//         let element = document.evaluate(ch_img, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         return element ? element.src : '';  // Change this line
//     }, ch_img);


//     let follower = await page.evaluate((ch_follower) => {
//         let element = document.evaluate(ch_follower, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         return element ? element.textContent : '';
//     }, ch_follower);

//     let likes = await page.evaluate((ch_likes) => {
//         let element = document.evaluate(ch_likes, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         return element ? element.textContent : '';
//     }, ch_likes);

//     let video = await page.evaluate((ch_video) => {
//         let element = document.evaluate(ch_video, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         return document.querySelector('video').src;
//     }, ch_video);

//     return {
//         channelName: chname,
//         following: following,
//         img: img,
//         follower: follower,
//         likes: likes,
//         url: url,
//         video: video,
//     };
// }
// module.exports = async (client) => {
//     const channel = await client.channels.cache.get('1240554928024326175');
//     const deletemessage = await channel.messages.fetch({ limit: 4 });
//     await deletemessage.forEach(async deletemessage => {
//         await deletemessage.delete();
//     });
    

//     try {
//         const  username = 'bp_tiktok' 
//         const data = await getTikTokProfileData(username);
//         const embed = new EmbedBuilder()
//             .setColor(0x0099FF) // Example color: blue
//             .setTitle(`@${username}`)
//             .setThumbnail(`${data.img}`)
//             .addFields(
//                 { name: '\u200B', value: ' ' },
//                 { name: 'Channel Name 📋', value: ` [${data.channelName}]`,inline : true },
//                 { name: 'Following 🌐', value: ` [${data.following}] `,inline : true },
//                 { name: '\u200B', value: ' ' },
//                 { name: 'Follower 👤', value: ` [${data.follower}] `,inline : true },
//                 { name: 'Likes 👍', value: `  [${data.likes}] `,inline : true },
                
//                 // Add other fields asF needed
//             )
//             .setURL(`${data.url}`)
//             .setTimestamp()
//             .setFooter({ text: `${data.channelName}`});
//         const message = await channel.send({ embeds: [embed] });
//         setInterval(async () => {
//             await embed.setFields(
//                 { name: '\u200B', value: ' ' },
//                 { name: 'Channel Name 📋', value: ` [${data.channelName}]`,inline : true },
//                 { name: 'Following 🌐', value: ` [${data.following}] `,inline : true },
//                 { name: '\u200B', value: ' ' },
//                 { name: 'Follower 👤', value: ` [${data.follower}] `,inline : true },
//                 { name: 'Likes 👍', value: `  [${data.likes}] `,inline : true },
                
//             )
//                 .setURL(`${data.url}`)
//                 //.setImage(`${data.img}`) 
//                 .setTimestamp()
//                 .setFooter({ text: `${data.channelName}`});
//             await message.edit({ embeds: [embed] });
//         }, 60000)
//     } catch (error) {
//         console.error(error);
//     }
// }


