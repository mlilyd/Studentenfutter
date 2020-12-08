import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Image,Text } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Sprite from './src/components/Sprite';
import Floor from './src/components/Floor';
import Physics from './src/components/Physics';
import Constants from './src/Constants';
import bg from './src/assets/bg.png';
import heart from './src/assets/heart.png';

export default class App extends Component {
    constructor(props){
        super(props);

        this.a="test";
        this.b="test"; 
        
        this.state = {
            running: true,
            score: 0,
        };

        this.heartCounter = 1;
        this.gameEngine = null;
        this.entities = this.setupWorld();
    }

    //setup world defines various entities
    setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;
        //before the first user tap, gravity is 0
        world.gravity.y =0;

        //define bodies -> each entity/sprite consists of rectangles ...
        let squirrel = Matter.Bodies.rectangle( 
          Constants.MAX_WIDTH / 4, 
          Constants.MAX_HEIGHT - 90, 
          Constants.SQUIRREL_WIDTH, 
          Constants.SQUIRREL_HEIGHT,
          {label:"squirrel"});
          
        let floor1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT - 70,
            Constants.MAX_WIDTH + 4,
            45,
            { isStatic: true, label:"floor1" }
        );

        let floor2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            Constants.MAX_HEIGHT - 70,
            Constants.MAX_WIDTH + 4,
            45,
            { isStatic: true, label:"floor2" }
        );

        //add rectangle bodies to world    
        Matter.World.add(world, [squirrel, floor1, floor2]);
        Matter.Events.on(engine, 'collisionStart', (event) => {
            let pairs = event.pairs;
            pairs.forEach(function(pair){
                if(pair.bodyA === "squirrel"){
                    switch (pair.bodyB.label){
                        case 'heart':
                            this.gameEngine.dispatch({type: 'add-heart'});
                            break;
                        case 'hurdle':
                            this.gameEngine.dispatch({type: 'game-over'});
                    }
                }
            });
        });

        //define entitities: 
        return {
            physics: { engine: engine, world: world },
            floor1: { body: floor1, renderer: Floor },
            floor2: { body: floor2, renderer: Floor },
            /* to add other sprites that are not randomly generated you need to add an entry like the squirrel e.g.: 
               sprite: { body: <define MatterJS rectangle above>, 
                         img_file: <name as defined in Sprite.js>,
                         renderer: Sprite}
            */
            squirrel: { body: squirrel, img_file: 'squirrel', renderer: Sprite}
        }
    }

    onEvent = (e) => {
        if (e.type === "game-over"){
            //Alert.alert("Game Over");
            this.setState({
                running: false
            });
        }
        if (e.type === "add-heart"){
            this.heartCounter += 1;
        }
    }

    reset = () => {
        this.gameEngine.swap(this.setupWorld());
        this.setState({
            running: true
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={bg} style={styles.backgroundImage} resizeMode="stretch" />
                
                <Text style={styles.heartCounter}> 
                    <Image source={heart} style={styles.heartCounter_img} resizeMode="contain" /> : {this.heartCounter}
                </Text>
                
                <Text>{this.a}</Text>
                <Text>{this.b}</Text>

                <TouchableOpacity 
                  style={styles.fullScreenButton}>
                </TouchableOpacity>

                
                <GameEngine
                    ref={(ref) => { this.gameEngine = ref; }}
                    style={styles.gameContainer}
                    systems={[Physics]}
                    running={this.state.running}
                    onEvent={this.onEvent}
                    entities={this.entities}>
                    <StatusBar hidden={true} />
                </GameEngine>
                

            </View>
        );
    }
}

//css styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT
    },
    heartCounter_img: {
        position: 'relative',
        top: 0,
        bottom:0,
        left:0,
        right:0,
        width:10,
        height:10
    },
    heartCounter: {
        position: 'absolute',
        top: 40,
        bottom:20,
        left: 40,
        right:50,
        width:200,
        height:30
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gameOverText: {
        color: 'white',
        fontSize: 48,
        fontFamily: '04b_19'
    },
    gameOverSubText: {
        color: 'white',
        fontSize: 24,
        fontFamily: '04b_19'
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    score: {
        position: 'absolute',
        color: 'white',
        fontSize: 72,
        top: 50,
        left: Constants.MAX_WIDTH / 2 - 20,
        textShadowColor: '#444444',
        textShadowOffset: { width: 2, height: 2},
        textShadowRadius: 2,
        fontFamily: '04b_19'
    },
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    }
});