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

export default class Game extends Component {
    constructor(props){
        super(props);
       
        //game state values
        this.state = {
            running: true,    //whether squirrel is running or not
            score: 0,         //how many scores
            heart: 1,         //how many hearts
            question: false,  //whether currently answering question or not
            gameover: false,  //whether game is over or not -> different from running because game should be able to be paused(?)

        };
        this.gameEngine = null;
        this.entities = this.setupWorld();
    }

    //setup world, defines game entities, such as floor, squirrel
    setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;
        //before the first user tap, gravity is 0
        world.gravity.y =0;

        //define bodies -> each entity/sprite consists of rectangles ...
        let squirrel = Matter.Bodies.rectangle( 
          Constants.MAX_WIDTH / 4,     // x value
          Constants.MAX_HEIGHT * 0.9,  // y value
          Constants.SQUIRREL_WIDTH,    // width 
          Constants.SQUIRREL_HEIGHT,   // height
          {label:"squirrel"});
          
        let floor1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT * 0.9,
            Constants.MAX_WIDTH + 4,
            45,
            { isStatic: true, label:"floor1" }
        );

        let floor2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            Constants.MAX_HEIGHT *0.9,
            Constants.MAX_WIDTH + 4,
            45,
            { isStatic: true, label:"floor2" }
        );

        //add rectangle bodies to world    
        Matter.World.add(world, [squirrel, floor1, floor2]);

        //collision detection -> sends event signals that will be handled in onEvent. 
        //Different entity should trigger different events. 
        Matter.Events.on(engine, 'collisionStart', (event) => {
           let pairs = event.pairs;
           let gameEngine = this.gameEngine;
           pairs.forEach(function(pair) {
               switch(pair.bodyB.label){
                   //if squirrel hits log, game over
                   case 'hurdle':
                       gameEngine.dispatch( {type: 'game-over'});
                       break;
                    //if squirrel hits heart, increase game state heart
                    case 'heart':
                        gameEngine.dispatch( {type: 'add-heart'});
                        break;
               }
           });
           //this.gameEngine.dispatch( {type:'game-over'});
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
            squirrel: { body: squirrel, img_file: "squirrel_1", renderer: Sprite}
        }
    }

    // takes signal from collision detection and do differents things based on the event. 
    //event management should be handled through game states.
    onEvent = (e) => {
        switch (e.type){
            //if squirrel hits log, game over
            case 'game-over':
                this.setState({
                    running: false,
                });
                break;
            //if squirrel hits heart, add heart
            case 'add-heart':
                this.setState({
                    heart: this.state.heart+1,
                });
                break;
        }
    }

    //reset game state
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
                    <Image source={heart} style={styles.heartCounter_img} resizeMode="contain" /> : {this.state.heart}
                </Text>
                
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
                    <StatusBar hidden={false} />
                </GameEngine>

                {!this.state.running &&
                <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Game Over</Text>
                    </View>
                </TouchableOpacity>}
            </View>
        );
    }
}

//////////////////////CSS styles/////////////////////////////////
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