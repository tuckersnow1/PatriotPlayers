const { ChannelType } = require('discord.js');
const { server_id, lobby_text, lobby_voice } = require('../botconfig.json');

module.exports = {
    name: 'channel',                // creates or removes channel with channel name of type channel_type 
    async execute(client, channel_name, channel_type, action) {

        const nchannels = ['general'];      // undeleteable channels

        if(action == 'delete'){
            if(nchannels.includes(channel_name)){               // throw error in console, if attempt to delete nchannel
                console.error('You cannot delete a protected channel.');
            }

            try{
                const guild = await client.guilds.fetch(server_id); // get the server

                var category = (channel_type == 'voice') ? lobby_voice : lobby_text;
                var name = (channel_type == 'text') ? channel_name.toLowerCase().replace(/ /g, "-") : channel_name;             // make name match discord naming convention if necessary
                var channel = guild.channels.cache.find(channel => channel.name === name && channel.parent.id === category);     // get the channel
            }
            catch(err){
                return console.log('Error Channel or Server not found.');
            }
                
            if (!channel) {                                     // if the channel does not exist
                console.error('Channel does not exist.');    
            }
            else{
                try{
                    channel.delete();           // delete the channel
                    return;
                }
                catch(err){
                    return console.log('Error with deleting Channel.');
                }
            }
        }
        else if(action == 'create'){
            if(nchannels.includes(channel_name)){               // throw error in console, if attempt to create a nchannel
                console.error('You cannot create a protected channel.');
            }

            try{
                const guild = await client.guilds.fetch(server_id);     // get server

                var c_type = (channel_type == 'voice') ? ChannelType.GuildVoice : ChannelType.GuildText;        // get channel type and channel category
                var category = (channel_type == 'voice') ? lobby_voice : lobby_text;

                var channel = await guild.channels.create({
                    name: channel_name,      // create channel
                    type: c_type, 
                    topic: channel_name,
                    parent: category,
                });
                return;
            }
            catch(err){
                console.log(err);
               return;
            }
        }
      
    }
  };