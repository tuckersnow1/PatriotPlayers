const { channel_id } = require('../botconfig.json');

module.exports = {
    name: 'ready',                  // print login message in console and channel
    async execute(client) {                 
        console.log(`Logged in as ${client.user.tag}!`);

        try {
          const channel = await client.channels.fetch(channel_id); 
          channel.send(`${client.user.username} is ready!`); // Send a message to the channel
        } 
        catch (error) {
          console.error(error); // Log the error to the console
        }
      }
    };
  