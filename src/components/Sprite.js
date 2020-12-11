import React, {Component} from "react";
import {Image} from "react-native";

let Images = {
    log: require("../assets/log.png"),
    squirrel: require("../assets/squirrel.png"),
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
            <Image
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