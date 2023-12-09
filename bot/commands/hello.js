module.exports = {
	name: 'hello',      // Send a hello message to the channel
	execute(client, message, args) {
	  message.channel.send(`Hello, ${message.author}!`);
	}
      };