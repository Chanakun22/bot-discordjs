const { Client, GatewayIntentBits, ActivityType, InteractionCollector } = require('discord.js');
const { CommandKit } = require('commandkit');
const path = require('path');
const { type } = require('os');
const pets = require('./commands/data/pets.json')


require("dotenv").config()

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
});

new CommandKit({
    client,
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
    validationsPath: path.join(__dirname, 'validations'),
    devGuildIds: ['1169260319823106169'],
    bulkRegister: true,

});

client.login(process.env.token)

