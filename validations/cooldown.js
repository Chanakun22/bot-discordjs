module.exports = ({ interaction,commandObj,handler}) =>{
    if(commandObj.option?.cooldown){
        interaction.reply('You are on cooldown!')
        return true
    }
}