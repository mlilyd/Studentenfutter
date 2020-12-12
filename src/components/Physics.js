import Matter from "matter-js";
import Constants from "../Constants";
import Sprite from "./Sprite";

let hurdleCount = 0;
let heartCount = 0;
let trashCount = 0;

let tick = 0;
let paused = true;
let question = false;
let to_delete = '';
let correct_answer = false;

let pose = 1;
let squirrel_init_y = 0;

///////////////////////////////// helping functions //////////////////////////////////////////////////////////////
export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max-min+1) + min);
}

export const pause_game = (b) => {
    paused = b;
}

export const isCorrect = (b) => {
    correct_answer = b;
}
export const delete_entity = (b) => {
    to_delete = b;
}

export const setQuestion = (b) => {
    question = b;
}

export const resetHurdles = (entities) => {
    hurdleCount = 0;

    //Matter.World.remove(entities.world, entities.hurdle1.body);
    //Matter.World.remove(entities.world, entities.hurdle2.body);
    delete entities['hurdle1'];
    delete entities['hurdle2'];
}

export const resetHeart = () => {
    heartCount = 0;
}

export const generateHurdles = (world, entities) => {
    
    let x = randomBetween(Constants.MAX_WIDTH, Constants.MAX_WIDTH+200);
    
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
    
    let x = randomBetween(Constants.MAX_WIDTH, Constants.MAX_WIDTH+200);
    
    let heart = Matter.Bodies.rectangle(
                x, 2/3*Constants.MAX_HEIGHT,
                20,20,
                { isStatic: true , label:"heart"}
    );
    
    
    Matter.World.add(world, [heart]);

    entities["heart"] = {
        body: heart, img_file: 'heart', renderer: Sprite
    }

    heartCount += 1;

}

export const generateTrash = (squirrel, world, entities) => {
    delete entities['heart'];
    delete entities['hurdle1'];
    delete entities['hurdle2'];

    let x = randomBetween(Constants.MAX_WIDTH, Constants.MAX_WIDTH+200);
    
    let trash = Matter.Bodies.rectangle(
        x, Constants.MAX_HEIGHT*0.849,
        19,25,
        { isStatic: true, label:"trash" }
    );
    
    trashCount += 1;
    Matter.World.add(world, [trash]);
    
    entities["trash"] = {
        body: trash, img_file: 'question', renderer: Sprite
    }

    

}

////////////////////////////////////// define physics  /////////////////////////////////////////////////////////
const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    let world = entities.physics.world;
    let squirrel = entities.squirrel.body;

    touches.filter(t => t.type === "press").forEach(t => {
        if (paused && !question){
            world.gravity.y = 1.05;
            paused = false;
        }
             Matter.Body.setVelocity(squirrel, {x: 0, y: -25});            
        });
        
    Matter.Engine.update(engine, time.delta);

    //generate random sprites     
    if (tick%183 == 0 && !paused){
        generateHurdles(world, entities);  
    }
    if (hurdleCount == 2){
        resetHurdles(entities);
    }
    if(tick%400 == 0 && !paused && heartCount<5){
        generateHearts(squirrel, world, entities);
    }
    if(tick%500 == 0 && !paused && trashCount<6){
        generateTrash(squirrel, world, entities);
    }
    
    tick += 1;

    switch (to_delete){
        case '':
            break;
        case 'heart':
            //Matter.World.remove(entities.world, entities.heart.body);
            delete entities.heart;
            break;
        case 'trash':
            //Matter.World.remove(entities.world, entities.trash.body);
            delete entities.trash;
            break;
    }

    if (correct_answer){
        if (typeof entities.trash === 'object' && entities.trash !== null){
        entities.trash.img_file = 'nut';
        entities.trash.body.label = 'nut';
        correct_answer = false;
    }}
    //making sure squirrel stays on screen by pushing squirrel towards the center if it gets too close to the edge of the screen
    //not sure if necessary
    if (squirrel.position.x >= Constants.MAX_WIDTH){
        Matter.Body.setVelocity(squirrel, {x: -10, y:0});
        Matter.Body.translate(squirrel, {x: -30, y:0});
    }
    if (squirrel.position.x < 30){
        Matter.Body.setVelocity(squirrel, {x: 10, y:0});
    }

    /* has flickering issues! Maybe need to adjust sprite renderer
    ///squirrel animation: updates squirrel animation to a new frame every 3 ticks
    if (tick% 3 == 0 && world.gravity.y > 0) {
        pose += 1;
        if (pose%7 == 0)
            pose = 1;
        entities.squirrel.img_file = "squirrel_" + (pose);  
    }
    //*/
    if (!paused){
    //moves floor to the left of the screen to simulate movement
    Object.keys(entities).forEach(key => {
        // key.indexOf(<entity key>) defines which game entities should move to the left
        if (key.indexOf("floor") === 0 || key.indexOf("hurdle") === 0 || key.indexOf("heart") === 0 || key.indexOf("trash") === 0){
            // onlyy move flor if game is running
            if (world.gravity.y != 0){
            if (entities[key].body.position.x <= -1 * Constants.MAX_WIDTH / 2){
                Matter.Body.setPosition(entities[key].body, { x: Constants.MAX_WIDTH + (Constants.MAX_WIDTH*.4505), y: entities[key].body.position.y})
            } else {
                Matter.Body.translate(entities[key].body, {x: -10, y: 0});
                
            }
            
            }
        
        }
    })}

    return entities;
};

export default Physics;