var events = require('events');
var Emitter = new events.EventEmitter();

var connectionHandler = function connected() {

    console.log('connection established');
    Emitter.emit('data received');
};

Emitter.on('connection', connectionHandler);

Emitter.on('data received', function () {
   console.log('data received successfully');
});

Emitter.emit('connection');
console.log('connection closed');
