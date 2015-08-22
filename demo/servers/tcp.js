var _ = require('lodash'),
	net = require('net');

var server = new net.createServer(function(conn){
	conn.setNoDelay(true); // don't delay packets
	conn.setKeepAlive(true); // don't disconnect after lack of packets

	// ----------- Game Variables

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

	// prevent reduntant data
	var currentData, lastData;

	var updateGame = function(){
		currentData = JSON.stringify(physics);
	    if(currentData != lastData){
			conn.write(currentData);
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

	conn.on('data', function(rawData){
		var data = false;
		try{
			data = JSON.parse(String(rawData));
		}catch(e){
			console.log('received invalid format for data');
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
	conn.on('error', function(err){
		console.error('client error', err);
	})

	console.log('new session');
	conn.on('end', function(){
		console.log('client disconnected');
	});
});

server.listen(8123, function(){
	console.log('TCP Server online %s:%s', server.address().address, server.address().port);
})