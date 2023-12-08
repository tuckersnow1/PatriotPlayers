const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./bot/botconfig.json'); 
const fs = require('fs');

// create client
const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
] });

// Create a collection for the commands
client.commands = new Collection();

// Read the command files and register them with client
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./bot/commands/${file}`);
  client.commands.set(command.name, command);
}

// Create a collection for the events
client.events = new Collection();

// Read the event files and register them with client
const eventFiles = fs.readdirSync('./bot/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./bot/events/${file}`);
  client.events.set(event.name, event);
}

// Login with the bot token
client.login(token);

module.exports = client;  // Export the client object
