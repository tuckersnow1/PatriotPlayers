const { server_id } = require('../botconfig.json');

module.exports = {
    name: 'dm',             // send a the msg to the user with userid
    async execute(client, msg, username) {
      try{
        //const user = await client.users.fetch(userid);      // expects userid instead of username
        //user.send(msg);

        const guild = await client.guilds.cache.get(server_id);
        const members = await guild.members.fetch();

        lcreator = members.find((member) => {
          if(member.user.username === username) {
            return true;
          }
          else if(member.user.username + '#' + member.user.discriminator === username) {
            return true;
          }
          else if(member.user.globalName === username) {
            return true;
          }
          else if(member.user.tag === username) {
            return true;
          }
        });

        lcreator.user.send(msg);
      }
      catch(err){
        console.log(err);
      }
    }
  };