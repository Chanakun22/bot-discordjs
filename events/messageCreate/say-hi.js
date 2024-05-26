module.exports = (message, client) => {
    if (message.author.bot) return
    if (message.content === '!hey') {
        message.reply(`Hi! ${message.author.username}`);
        return true
    }
};