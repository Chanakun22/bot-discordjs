const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
;
const { CommandKit } = require('commandkit');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const clientId = '1232557013041414165';
const guildId = '1169260319823106169';

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

// Function to load commands recursively
const loadCommands = (dir) => {
    const commands = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            commands.push(...loadCommands(filePath));
        } else if (file.name.endsWith('.js')) {
            const command = require(filePath);
            if ('data' in command && 'run' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    return commands;
};

const commandsPath = path.join(__dirname, 'commands');
const commands = loadCommands(commandsPath);

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Deploy commands
console.clear();
(async () => {
    try {


        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        (async () => {
            const chalk = await import('chalk');
            console.log(chalk.default.hex('#00ffff').bold(`Successfully reloaded ${data.length} application (/) commands.`));
        })();
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    (async () => {
        const chalk = await import('chalk');
        console.log(chalk.default.hex('#00ffff').bold(`Ready! Reloaded ${commands.length} command(s).`));
    })();
});


client.login(process.env.TOKEN);
