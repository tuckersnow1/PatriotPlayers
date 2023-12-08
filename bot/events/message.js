module.exports = {
  name: 'message',
  execute(client, message) {
    // Ignore messages from bots and messages without the prefix
    if (message.author.bot || !message.content.startsWith('!')) return;

    // Get the command name and the arguments from the message
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Get the command from the client commands collection
    const command = client.commands.get(commandName);

    // If the command does not exist, return
    if (!command) return;

    // Execute the command with the client, message, and args
    command.execute(client, message, args);
  }
};
