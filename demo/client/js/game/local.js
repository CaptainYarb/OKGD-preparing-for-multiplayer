var _ = require('lodash');

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
    local: new PIXI.Sprite(textures.car)
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
        physics.turningSpeed = 0;
    }
});


// kick off the animation loop (defined below)
animate();
function animate(){
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

function updateGame(){
    // update car position
    cars.local.position.x = physics.carPosition;

    // Totally not made up speed
    decorations.speedOmeter.text = String(Math.ceil(physics.carSpeed * 3)) + " mph"; 

    // update map for "speed"
    decorations.leftLane.tilePosition.y += physics.carSpeed;
    decorations.rightLane.tilePosition.y += physics.carSpeed;
    decorations.road.tilePosition.y += physics.carSpeed;
}

// ----------- [END] Game Display logic



// ----------- [START] Game Engine logic
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
        if(physics[key]){
            if(physics[key] > limit){
                physics[key] = limit;
            }else if(physics[key] < 0){
                physics[key] = 0;
            }
        }
    });
    updateGame();
}, 1000/60); // 60 ticks per second

// ----------- [END] Game Engine logic