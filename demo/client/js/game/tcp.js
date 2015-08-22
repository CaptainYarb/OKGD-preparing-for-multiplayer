var _ = require('lodash');

var server = {
    //address: 'localhost',
    address: '198.24.166.42', // US
    //address: '128.199.129.45', // Singapore
    port: 8123
}
// ----------- Game Variables

var localPhysics = {
    carPosition: 445,
    turningSpeed: 0
};

var physics = {
    carPosition: 445,
    carSpeed: 0,
    turningSpeed: 0
};

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

// ----------- [START] Game Display logic

var renderer = new PIXI.WebGLRenderer(800, 600);
document.getElementById('game').appendChild(renderer.view);
var stage = new PIXI.Container();

var textures = {
    car: PIXI.Texture.fromImage('assets/car.png'),
    lane: PIXI.Texture.fromImage('assets/line.png'),
    divider: PIXI.Texture.fromImage('assets/middle.png'),
    road: PIXI.Texture.fromImage('assets/road.png'),
};

var cars = {
    local: new PIXI.Sprite(textures.car),
    network: new PIXI.Sprite(textures.car),
};

var decorations = {
    road: new PIXI.extras.TilingSprite(textures.road, 800, 600),
    rightLane: new PIXI.extras.TilingSprite(textures.lane, 5, 600),
    leftLane: new PIXI.extras.TilingSprite(textures.lane, 5, 600),
    divider: new PIXI.extras.TilingSprite(textures.divider, 15, 600),
    speedOmeter:new PIXI.Text('0 mph', {font: '24px Open Sans', fill: '#ffffff', align: 'center'})
}

_.each(cars, function(car, index){
    cars[index].position.x = physics.carPosition;
    cars[index].position.y = 350;
});

// ghost local car
cars.local.alpha = 0.5;


// middle lane
decorations.divider.position.x = 395;
decorations.divider.position.y = 0;
decorations.divider.alpha = 0.9;

// dashed lanes
decorations.rightLane.position.x = 197;
decorations.rightLane.position.y = 0;
decorations.rightLane.alpha = 0.9;

decorations.leftLane.position.x = 597;
decorations.leftLane.position.y = 0;
decorations.leftLane.alpha = 0.9;

// Speedometer
decorations.speedOmeter.position.x = 5;
decorations.speedOmeter.position.y = 5;


// add items to stage
_.each(decorations, function(decoration, index){
    stage.addChild(decorations[index]);
});

_.each(cars, function(car, index){
    stage.addChild(cars[index]);
});


// ----------- controls
$('body').keydown(function(e){
    switch(e.keyCode){
        case 37:
        case 65:
            pressed.left = true;
        break;
        case 38:
        case 87:
            pressed.up = true;
        break;
        case 39:
        case 68:
            pressed.right = true;
        break;
        case 40:
        case 83:
            pressed.down = true;
        break;
    }
    applyControls();
});
$('body').keyup(function(e){
    switch(e.keyCode){
        case 37:
        case 65:
            pressed.left = false;
        break;
        case 38:
        case 87:
            pressed.up = false;
        break;
        case 39:
        case 68:
            pressed.right = false;
        break;
        case 40:
        case 83:
            pressed.down = false;
        break;
    }
    if(!pressed.left && !pressed.right){
        localPhysics.turningSpeed = 0;
    }
    applyControls();
});


// kick off the animation loop (defined below)
animate();
function animate(){
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

function runLocalGame(){
    updateGame();

    // basic turning
    if(pressed.left){
        localPhysics.carPosition -= localPhysics.turningSpeed;
    }
    if(pressed.right){
        localPhysics.carPosition += localPhysics.turningSpeed;
    }

    // increase speed of turning based on duration of press for next tick
    if(pressed.left || pressed.right){
        localPhysics.turningSpeed += 0.5;
    }else{
        localPhysics.turningSpeed -= 0.5;
    }

    // enforce limits
    _.each(limits, function(limit, key){
        if(localPhysics[key] != undefined){
            if(localPhysics[key] > limit){
                localPhysics[key] = limit;
            }else if(localPhysics[key] < 0){
                localPhysics[key] = 0;
            }
        }
    });
    cars.local.position.x = localPhysics.carPosition;
}

function updateGame(){
    // update car position
    cars.network.position.x = physics.carPosition;

    // Totally not made up speed
    decorations.speedOmeter.text = String(Math.ceil(physics.carSpeed * 3)) + " mph"; 

    // update map for "speed"
    decorations.leftLane.tilePosition.y += physics.carSpeed;
    decorations.rightLane.tilePosition.y += physics.carSpeed;
    decorations.road.tilePosition.y += physics.carSpeed;
}

// ----------- [END] Game Display logic
var net = require('net');

var socket = net.connect(server.port, server.address, function(conn){
    socket.on('data', function(rawData){
		var data = false;
		try{
			data = JSON.parse(rawData);
		}catch(e){
		// bad json
		}
		if(!data){return;}

        console.log('Rec Data!', data);
        _.each(data, function(value, key){
            if(physics[key] !== undefined){
                physics[key] = value;
            }
        });
    });
});


var lastData, currentData;
var applyControls = function(){
    // send controls dif
    currentData = JSON.stringify(pressed);
    if(currentData != lastData){
        socket.write(currentData);
        lastData = currentData;
        console.log('sending', currentData)
    }
}

// kick off the animation loop (defined below)
animate();
function animate(){
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}
setInterval(runLocalGame, 1000/60); // 60 ticks per second