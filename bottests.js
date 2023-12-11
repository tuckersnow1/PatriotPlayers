// const client = require('./bot.js');         // just to test if calling client emit works outside of index.js


function test() {

    setTimeout(function() {             // run 10 seconds after startup

        // client.emit('sendDm', "Hello 1", '431803299038232577');   // sends a private message "hello 1" to user with discord user id 
    
        client.emit('channel', 'Lobby Channel', 'voice', 'create');                 //  create a voice channel called Lobby Channel

        client.emit('channel', 'Text Channel', 'text', 'create');                       //  create a text channel called text Channel

    }, 10000);
    
    
    setTimeout(function() {             // run 30 seconds after startup

        client.emit('channel', 'Lobby Channel', 'voice', 'delete');                     // deletes voice channle called Lobby Channel

        client.emit('channel', 'Text Channel', 'text', 'delete');                   //  deletes a text channel called text Channel
        
    
    }, 30000);


}

module.exports = test;