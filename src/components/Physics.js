import Matter from "matter-js";
import Constants from "../Constants";
import Sprite from "./Sprite";

let hurdleCount = 0;
let heartCount=0;
let tick = 0;

export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max-min+1) + min);
}

export const resetHurdles = () => {
    hurdleCount = 0;
}

export const generateHurdles = (squirrel, world, entities) => {
    
    let x = randomBetween(squirrel.position.x+Constants.SQUIRREL_WIDTH+ 5, Constants.MAX_WIDTH);
    
    let hurdle = Matter.Bodies.rectangle(
        x,
        Constants.MAX_HEIGHT-100,
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
    

    let heart = Matter.Bodies.rectangle(x,2/3*Constants.MAX_HEIGHT,10,10,
        { isStatic: true , label:"heart"}
    );
    
    heartCount += 1;
    Matter.World.add(world, [heart]);

    entities["heart" + (heartCount)] = {
        body: heart, img_file: 'heart', renderer: Sprite
    }

}

const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    let world = entities.physics.world;
    let squirrel = entities.squirrel.body;

    touches.filter(t => t.type === "press").forEach(t => {
        if (world.gravity.y == 0){
            world.gravity.y = 1.7;
            world.gravity.x = 0;
        }
            Matter.Body.setVelocity(squirrel, {x: 0, y: -20});

        });
    

    tick += 1;

    if (tick%183 == 0 && world.gravity.y != 0){
        generateHurdles(squirrel, world, entities);  
    }
    if (hurdleCount == 2){
        resetHurdles();
    }
    if(tick%400 == 0 && world.gravity.y != 0 && heartCount<5){
        generateHearts(squirrel, world, entities);
    }

    if (squirrel.position.x >= Constants.MAX_WIDTH){
        Matter.Body.setVelocity(squirrel, {x: -10, y:0});
        Matter.Body.translate(squirrel, {x: -30, y:0});
    }
    if (squirrel.position.x < 30){
        Matter.Body.setVelocity(squirrel, {x: 10, y:0});
    }
   
    
    Matter.Engine.update(engine, time.delta);

    Object.keys(entities).forEach(key => {
        if (key.indexOf("floor") === 0 || key.indexOf("hurdle") === 0 || key.indexOf("heart") === 0){
            if (world.gravity.y != 0){
            if (entities[key].body.position.x <= -1 * Constants.MAX_WIDTH / 2){
                Matter.Body.setPosition(entities[key].body, { x: Constants.MAX_WIDTH + (Constants.MAX_WIDTH/2) + 3, y: entities[key].body.position.y})
            } else {
                Matter.Body.translate(entities[key].body, {x: -7, y: 0});
                
            }
            
            }
        
        }
    })

    return entities;
};

export default Physics;