import React, {Component} from "react";
import {Animated, Image} from "react-native";

/* 
Using the Sprite class: 
    - add pictures to assets folder
    - add entry in Images

In Game.js/Physics.js, define a Matterjs body that describes where the image will appear.
Then, add this to game entities
    in Game.js:
        sprite: { body: <define MatterJS rectangle above>, 
            img_file: <name as defined in Sprite.js>,
            renderer: Sprite}
    in Phyysics
*/


let Images = {
    log: require("../assets/log.png"),
    squirrel: require("../assets/squirrel.png"),
    squirrel_1: require("../assets/squirrel_1.png"),
    squirrel_2: require("../assets/squirrel_2.png"),
    squirrel_3: require("../assets/squirrel_3.png"),
    squirrel_4: require("../assets/squirrel_4.png"),
    squirrel_5: require("../assets/squirrel_5.png"),
    squirrel_6: require("../assets/squirrel_6.png"),
    squirrel_7: require("../assets/squirrel_7.png"),
    heart: require("../assets/heart.png"),
    nut: require("../assets/nut.png"),
    trash: require("../assets/trash.png")
};

export default class Sprite extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const width = this.props.body.bounds.max.x - this.props.body.bounds.min.x;
        const height = this.props.body.bounds.max.y - this.props.body.bounds.min.y;
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        
        let image = Images[this.props.img_file];

        return (
            <Animated.Image
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height
                }}
                resizeMode="stretch"
                source={image} />
        );
    }
}