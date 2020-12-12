import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Image, Text, Keyboard, TextInput  } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

import Sprite from './src/components/Sprite';
import Floor from './src/components/Floor';
import Physics, {resetHeart, pause_game, delete_entity, isCorrect} from './src/components/Physics';
import Constants from './src/Constants';

import bg from './src/assets/bg.png';
import heart from './src/assets/heart.png';
import nut from './src/assets/nut.png';

export default class Game extends Component {
    constructor(props){
        super(props);
       
        //game state values
        this.state = {
            running: true,    //whether game is running or not. To pause game, use pause_game from Physicsjs
            heart: 1,         //how many hearts
            nut: 0,           //how many nuts
            question: false,  //whether currently answering question or not
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
          Constants.MAX_HEIGHT * 0.84,  // y value
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
                       gameEngine.dispatch( {type: 'game-over'} );
                       break;
                    //if squirrel hits heart, increase game state heart
                    case 'heart':
                        gameEngine.dispatch( {type: 'add-heart'} );
                        break;
                    //if squirrel hits trash, display question
                    case 'trash':
                        gameEngine.dispatch( {type: 'question'} );
                        break;
                    case 'nut':
                        gameEngine.dispatch( {type: 'add-nut'} );
                        break;
               }
           });
        });

        //add entitities to entities list
        return {
            physics: { engine: engine, world: world, running: this.state.running},
            floor1: { body: floor1, renderer: Floor },
            floor2: { body: floor2, renderer: Floor },
            squirrel: { body: squirrel, img_file: "squirrel_1", renderer: Sprite}
        }
    }

    // takes signal from collision detection and do differents things based on the event. 
    // event management should be handled through game states.
    onEvent = (e) => {
        switch (e.type){
            //if squirrel hits log, game over
            case 'game-over':
                this.setState({
                    running: false
                });
                break;
            //if squirrel hits heart, add heart
            case 'add-heart':
                this.setState({
                    heart: this.state.heart+1,
                });
                //remove heart from screen once hit
                delete_entity('heart');
                resetHeart();
                break;
            //if squirrel hits trash, display question
            case 'question':
                this.setState({
                    question: true,
                    running: true
                });
                pause_game(true);
                break;
            //in cases which squirrel loses a heart, stop running until the next user tap (not game running, but physics running!)
            case 'min-heart':
                this.setState({
                    heart: this.state.heart-1
                });
                this.checkHeart();
                pause_game(true);
                break;
            //if player gives wrong answer, set question to false, decrease heart state, and check heart. Trash is deleted, and game is unpaused
            case 'wrong-answer':
                delete_entity('trash');
                this.setState({
                    heart: this.state.heart-1,
                    question: false
                });
                this.checkHeart();
                pause_game(false);
                break;
            //if player gives right answer trash turns into nut, set question to false, and unpause game.
            case 'right-answer':
                isCorrect(true);
                this.setState({
                    question: false
                });
                pause_game(false);
                break;
            //if squirrel hit nut increase nut state
            case 'add-nut':
                delete_entity('trash');
                this.setState({
                    nut: this.state.nut+1
                });
                break;
        }
    }

    //reset game states
    reset = () => {
        this.gameEngine.swap(this.setupWorld());
        resetHeart();
        this.setState({
            running: true,    //whether squirrel is running or not
            score: 0,         //how many scores
            heart: 1,         //how many hearts
            nut: 0,           //how many nuts
            question: false,  //whether currently answering question or not
        });
        pause_game(true);

    }

    //checks that heart is at least 1, otherwise game over
    checkHeart = () => {
        if (this.state.heart < 1){
            this.gameEngine.dispatch( {type: 'game-over'});
        }
    }

    //checks that answer is correct, called when submit button on question view is tapped.
    checkAnswer = () => {
        let correct = true;
        if (correct){
            this.gameEngine.dispatch( {type: 'right-answer'});
        } else {
            this.gameEngine.dispatch( {type: 'wrong-answer'});
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={bg} style={styles.backgroundImage} resizeMode="stretch" />
                
                <Text style={styles.heartCounter}> 
                    <Image source={heart} style={styles.heartCounter_img} resizeMode="contain" /> : {this.state.heart}
                </Text>

                <Text style={styles.nutCounter}> 
                    <Image source={nut} style={styles.nutCounter_img} resizeMode="contain" /> : {this.state.nut}
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

                {this.state.question &&
                <TouchableOpacity style={styles.fullScreenButton} onPress={this.checkAnswer}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.questionText}>Question</Text>
                        <Text style={styles.questionSubText}>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod? </Text>
                        <TextInput style={styles.textInput} placeholder="Your answer"/>
                        <Text style={styles.submitButton}>Submit</Text>
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
    textInput: {
        position:'absolute',
        borderColor: '#CCCCCC',
        backgroundColor:'#CCCCCC',
        borderTopWidth: 1,
        textAlign:'center',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        height: 200,
        width: 350,
        fontSize: 25,
        bottom:'15%',
        paddingLeft: 20,
        paddingRight: 20
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
    nutCounter_img: {
        position: 'relative',
        top: 0,
        bottom:0,
        left:0,
        right:0,
        width:13,
        height:13
    },
    nutCounter: {
        position: 'absolute',
        top: 40,
        bottom:20,
        left: 100,
        right:200,
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
    questionText: {
        position:'absolute',
        top:'5%',
        color: 'white',
        fontSize: 48,
        fontFamily: '04b_19'
    },
    questionSubText: {
        position:'absolute',
        color: 'white',
        fontSize: 24,
        fontFamily: '04b_19',
        textAlign:'left',
        top:'25%',
        paddingLeft: 20,
        paddingRight: 20
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
    },
    submitButton: {
        position:'absolute',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        bottom: 10,
        padding: 15,
        margin: 5
      },
});