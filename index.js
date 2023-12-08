const http = require('http');
const app = require('./app');
const client = require('./bot.js'); 

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);

//discord bot event listeners
client.on('ready', () => {
  client.events.get('ready').execute(client);
});

client.on('messageCreate', message => {
  client.events.get('message').execute(client, message);
});

client.on('sendDm', (msg_tosend, userid) => {
  client.events.get('dm').execute(client, msg_tosend, userid);
});

client.on('channel', (channel_name, channel_type, action) => {
  client.events.get('channel').execute(client, channel_name, channel_type, action);
});
