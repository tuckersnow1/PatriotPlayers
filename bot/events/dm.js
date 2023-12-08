module.exports = {
    name: 'dm',             // send a the msg to the user with userid
    async execute(client, msg, userid) {
      try{
        const user = await client.users.fetch(userid);
        user.send(msg);
      }
      catch(err){
        console.log(err);
      }
    }
  };