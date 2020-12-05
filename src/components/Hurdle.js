import React, { Component } from "react";
import { Image, Animated } from "react-native";
import image from "../assets/log.png"

export default class Squirrel extends Component {
    constructor(props){
        super(props);

    }

    render() {
        const width = this.props.body.bounds.max.x - this.props.body.bounds.min.x;
        const height = this.props.body.bounds.max.y - this.props.body.bounds.min.y;
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        
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