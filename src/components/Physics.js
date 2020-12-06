import Matter from "matter-js";
import Sprite from "./Sprite";
import Constants from "../Constants";


let hurdleCount = 0;
let tick = 0;

export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max-min+1) + min);
}

export const resetHurdles = () => {
    hurdleCount = 0;
}


export const generateHurdles = (squirrel, world, entities) => {
    //generate random x value in front of the squirrel
    let x = randomBetween(squirrel.position.x+Constants.SQUIRREL_WIDTH+ 5, Constants.MAX_WIDTH+10);
    
    let hurdle = Matter.Bodies.rectangle(
        Constants.MAX_WIDTH+10,
        Constants.MAX_HEIGHT-100,
        60,50,
        { isStatic: true }
    );
    
    hurdleCount += 1;
    
    //add hurdle to world
    Matter.World.add(world, [hurdle]);
    entities["hurdle" + (hurdleCount)] = {
        body: hurdle, img_file: 'log', renderer: Sprite
    }
}

// where game behaviours and logic is defined

const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    let world = entities.physics.world;
    let squirrel = entities.squirrel.body;

    //controls what happens on a tap
    touches.filter(t => t.type === "press").forEach(t => {
        //if first touch, turn on world gravity to start game
        if (world.gravity.y == 0){
            world.gravity.y = 1.7;
            world.gravity.x = 0;
        }
            //make squirrel jump on tap
            Matter.Body.setVelocity(squirrel, {x: 2, y: -25});

        });
    
    
    tick += 1;
    //add hurdle after every 183 ticks.
    if (tick%183 == 0 && world.gravity.y != 0){
        generateHurdles(squirrel, world, entities);  
    }

    //reset hurdle once there are too many
    if (hurdleCount == 2){
        resetHurdles();
    }

    //the next two if statements make sure that 
    if (squirrel.position.x >= Constants.MAX_WIDTH){
        Matter.Body.setVelocity(squirrel, {x: -10, y:0});
        Matter.Body.translate(squirrel, {x: -30, y:0});
    }
    if (squirrel.position.x < 30){
        Matter.Body.setVelocity(squirrel, {x: 10, y:0});
    }
    
    Matter.Engine.update(engine, time.delta);

    //the part that moves the floor to the right in a loop
    Object.keys(entities).forEach(key => {
        if (key.indexOf("floor") === 0 || key.indexOf("hurdle") === 0){
            if (world.gravity.y != 0){
            if (entities[key].body.position.x <= -1 * Constants.MAX_WIDTH/2){
                Matter.Body.setPosition(entities[key].body, { x: Constants.MAX_WIDTH +3, y: entities[key].body.position.y})
            } else {
                Matter.Body.translate(entities[key].body, {x: -15, y: 0});
                
            }
                
            }
        }
    })

    return entities;
};

export default Physics;