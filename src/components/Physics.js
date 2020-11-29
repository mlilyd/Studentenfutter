import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    let squirrel = entities.squirrel.body;

    touches.filter(t => t.type === "press").forEach(t => {
            Matter.Body.applyForce(squirrel, squirrel.position, {x: 0.00, y: -0.10});
        });

    Matter.Engine.update(engine, time.delta);

    Object.keys(entities).forEach(key => {
      if (key.indexOf("floor") === 0){
            if (entities[key].body.position.x <= -1 * Constants.MAX_WIDTH / 2){
                Matter.Body.setPosition(entities[key].body, { x: Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2), y: entities[key].body.position.y})
            } else {
                Matter.Body.translate(entities[key].body, {x: -2, y: 0});
            }
        }
    })

    return entities;
};

export default Physics;