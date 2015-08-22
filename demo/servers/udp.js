var _ = require('lodash'),
    dgram = require('dgram'),
	socket = dgram.createSocket('udp4');



var physics = {
    carPosition: 445,
    carSpeed: 0,
    turningSpeed: 0
}

var limits = {
    carPosition: 700,
    carSpeed: 35,
    turningSpeed: 10
};

var pressed = {
    up: false,
    left: false,
    right: false,
    down: false
};

var client = false; // only allow one connection at a time, quick demo is lazy demo

// prevent reduntant data
var currentData, lastData;

var updateGame = function(){
    if(!client){
        return;
    }
    currentData = JSON.stringify(physics);
    if(currentData != lastData){
        var message = new Buffer(currentData);
        socket.send(message, 0, message.length, client.port, client.address);
        lastData = currentData;
    }
}

setInterval(function(){
    // basic turning
    if(pressed.left){
        physics.carPosition -= physics.turningSpeed;
    }
    if(pressed.right){
        physics.carPosition += physics.turningSpeed;
    }

    // increase speed of turning based on duration of press for next tick
    if(pressed.left || pressed.right){
        physics.turningSpeed += 0.5;
    }else{
        physics.turningSpeed -= 0.5;
    }

    // Are we coasting or accelerating?
    if(pressed.up){
        physics.carSpeed += 0.05;
    }else{
        physics.carSpeed -= 0.01;
    }

    // brakes
    if(pressed.down){
        physics.carSpeed -= 0.1;
    }

    // enforce limits
    _.each(limits, function(limit, key){
        if(physics[key] !== undefined){
            if(physics[key] > limit){
                physics[key] = limit;
            }else if(physics[key] < 0){
                physics[key] = 0;
            }
        }
    });
    updateGame();
}, 1000/60); // 60 ticks per second

socket.on('message', function(rawData, rinfo){
	if(client !== false && client.address != rinfo.address){
		return console.log('Invalid socket attempting to connect');
	}
	var data = false;
	try{
		data = JSON.parse(String(rawData));
	}catch(e){
		console.log('received invalid format for data');
	}
	client = {
		address: rinfo.address,
		port: rinfo.port
	}
	if(!data){
		return;
	}
	// This should be better validated!
    _.each(data, function(value, key){
        if(pressed[key] !== undefined){
            pressed[key] = value;
        }
    });
});

socket.on('error', function(err){
    console.error('socket error', err);
})

socket.bind(41234);
socket.on('listening', function(){
    console.log('UDP Server online %s:%s', socket.address().address, socket.address().port);
});