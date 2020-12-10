import Matter from "matter-js";
import Constants from "../Constants";
import Sprite from "./Sprite";

let hurdleCount = 0;
let heartCount = 0;
let pose = 1;
let tick = 0;

///////////////////////////////// helping functions //////////////////////////////////////////////////////////////
export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max-min+1) + min);
}

export const resetHurdles = () => {
    hurdleCount = 0;
}

export const generateHurdles = (squirrel, world, entities) => {
    
    let x = randomBetween(Constants.MAX_WIDTH+ 200, Constants.MAX_WIDTH+20);
    
    let hurdle = Matter.Bodies.rectangle(
        x, Constants.MAX_HEIGHT*0.87,
        60,50,
        { isStatic: true, label:"hurdle" }
    );
    
    hurdleCount += 1;
    Matter.World.add(world, [hurdle]);
    
    entities["hurdle" + (hurdleCount)] = {
        body: hurdle, img_file: 'log', renderer: Sprite
    }

}

export const generateHearts = (squirrel, world, entities) =>{
    
    let x = randomBetween(squirrel.position.x+Constants.SQUIRREL_WIDTH+ 5, Constants.MAX_WIDTH);
    
    let heart = Matter.Bodies.rectangle(
                x, 2/3*Constants.MAX_HEIGHT,
                10,10,
                { isStatic: true , label:"heart"}
    );
    
    heartCount += 1;
    Matter.World.add(world, [heart]);

    entities["heart" + (heartCount)] = {
        body: heart, img_file: 'heart', renderer: Sprite
    }

}

////////////////////////////////////// define physics  /////////////////////////////////////////////////////////
const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    let world = entities.physics.world;
    let squirrel = entities.squirrel.body;

    touches.filter(t => t.type === "press").forEach(t => {
        if (world.gravity.y == 0){
            world.gravity.y = 1.05;
            world.gravity.x = 0;
        }
            Matter.Body.setVelocity(squirrel, {x: 0, y: -25});

        });
        
    Matter.Engine.update(engine, time.delta);

    //generate random sprites     
    if (tick%183 == 0 && world.gravity.y != 0){
        generateHurdles(squirrel, world, entities);  
    }
    if (hurdleCount == 2){
        resetHurdles();
    }
    if(tick%400 == 0 && world.gravity.y != 0 && heartCount<5){
        generateHearts(squirrel, world, entities);
    }
    
    tick += 1;

    /*
    //making sure squirrel stays on screen by pushing squirrel towards the center if it gets too close to the edge of the screen
    //not sure if necessary
    if (squirrel.position.x >= Constants.MAX_WIDTH){
        Matter.Body.setVelocity(squirrel, {x: -10, y:0});
        Matter.Body.translate(squirrel, {x: -30, y:0});
    }
    if (squirrel.position.x < 30){
        Matter.Body.setVelocity(squirrel, {x: 10, y:0});
    }
    */

    /* has flickering issues! Maybe need to adjust sprite renderer
    //squirrel animation: updates squirrel animation to a new frame every 3 ticks
    if (tick% 3 == 0 && world.gravity.y > 0) {
        pose += 1;
        if (pose%7 == 0)
            pose = 1;
        entities.squirrel.img_file = "squirrel_" + (pose);  
    }
    */
    
    //moves floor to the left of the screen to simulate movement
    Object.keys(entities).forEach(key => {
        // key.indexOf(<entity key>) defines which game entities should move to the left
        if (key.indexOf("floor") === 0 || key.indexOf("hurdle") === 0 || key.indexOf("heart") === 0){
            // onlyy move flor if game is running
            if (world.gravity.y != 0){
            if (entities[key].body.position.x <= -1 * Constants.MAX_WIDTH / 2){
                Matter.Body.setPosition(entities[key].body, { x: Constants.MAX_WIDTH + (Constants.MAX_WIDTH*.4505), y: entities[key].body.position.y})
            } else {
                Matter.Body.translate(entities[key].body, {x: -10, y: 0});
                
            }
            
            }
        
        }
    })

    return entities;
};

export default Physics;