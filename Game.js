import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Image, Text, Keyboard, TextInput, Button } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

import Sprite from './src/game/components/Sprite';
import Floor from './src/game/components/Floor';
import Physics, { resetHeart, pause_game, delete_entity, isCorrect, resetTrash } from './src/game/components/Physics';
import Constants from './src/game/Constants';

import bg from './src/assets/bg.png';
import heart from './src/assets/heart.png';
import nut from './src/assets/nut.png';

// https://medium.com/better-programming/flappy-bird-with-react-native-game-engine-and-matter-js-d5673f50eb9
// https://medium.com/better-programming/making-a-production-ready-flappy-bird-in-react-native-751713661a60
// https://code.tutsplus.com/tutorials/getting-started-with-matterjs-body-module--cms-28835
// https://brm.io/matter-js/docs/

export default class Game extends Component {
    constructor(props) {
        super(props);

        //game state values
        this.state = {
            running: true,            //whether game is running or not. To pause game, use pause_game from Physicsjs
            heart: 1,             //how many hearts
            nut: 0,               //how many nuts
            question: false,      //whether currently answering question or not
            answer: false,        //whether currently showing answer
            question_number: 0,

            question_text: '',
            right_answer: '',
            your_answer: ''
        };
        this.gameEngine = null;
        this.entities = this.setupWorld();

        //set deck as per user selection
        // let decks = Constants.DECKS;
        // let chosen_deck = "632mgp7hm68vzvg2amz1hq"; //need to be changed
        // this.deck = decks[0][chosen_deck];
        //this.deck = .... //import function to get selected deck 
    }

    //setup world, defines game entities, such as floor, squirrel
    setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;
        //before the first user tap, gravity is 0
        world.gravity.y = 0;

        //define bodies -> each entity/sprite consists of rectangles ...
        let squirrel = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 4,     // x value
            Constants.MAX_HEIGHT * 0.84,  // y value
            Constants.SQUIRREL_WIDTH,    // width 
            Constants.SQUIRREL_HEIGHT,   // height
            { label: "squirrel" });

        let floor1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT * 0.9,
            Constants.MAX_WIDTH + 4,
            45,
            { isStatic: true, label: "floor1" }
        );

        let floor2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            Constants.MAX_HEIGHT * 0.9,
            Constants.MAX_WIDTH + 4,
            45,
            { isStatic: true, label: "floor2" }
        );

        //add rectangle bodies to world    
        Matter.World.add(world, [squirrel, floor1, floor2]);

        //collision detection -> sends event signals that will be handled in onEvent. 
        //Different entity should trigger different events. 
        Matter.Events.on(engine, 'collisionStart', (event) => {
            let pairs = event.pairs;
            let gameEngine = this.gameEngine;
            pairs.forEach(function (pair) {
                switch (pair.bodyB.label) {
                    //if squirrel hits log, game over
                    case 'hurdle':
                        gameEngine.dispatch({ type: 'min-heart' });
                        break;
                    //if squirrel hits heart, increase game state heart
                    case 'heart':
                        gameEngine.dispatch({ type: 'add-heart' });
                        break;
                    //if squirrel hits trash, display question
                    case 'trash':
                        gameEngine.dispatch({ type: 'show-question' });
                        break;
                }
            });
        });

        //add entitities to entities list
        return {
            physics: { engine: engine, world: world, running: this.state.running },
            floor1: { body: floor1, renderer: Floor },
            floor2: { body: floor2, renderer: Floor },
            squirrel: { body: squirrel, img_file: "squirrel_1", renderer: Sprite }
        }
    }

    // takes signal from collision detection and do differents things based on the event. 
    // event management should be handled through game states.
    onEvent = (e) => {
        switch (e.type) {
            //if squirrel hits log, game over
            case 'game-over':
                this.setState({
                    running: false
                });
                break;
            //if squirrel hits heart, add heart
            case 'add-heart':
                this.setState({
                    heart: this.state.heart + 1,
                });
                //remove heart from screen once hit
                delete_entity('heart');
                resetHeart();
                break;
            //if squirrel hits trash, display question
            case 'show-question':
                this.getQuestion(this.state.question_number);
                this.setState({
                    question: true,
                    running: true,
                });
                pause_game(true);
                break;
            case 'show-answer':
                this.setState({
                    question: false,
                    answer: true,
                    running: true
                });
                break;
            //in cases which squirrel loses a heart, stop running until the next user tap (not game running, but physics running!)
            case 'min-heart':
                this.setState({
                    heart: this.state.heart - 1
                });
                this.checkHeart();
                pause_game(true);
                break;
            //if player gives wrong answer, set question to false, decrease heart state, and check heart. Trash is deleted, and game is unpaused
            case 'wrong-answer':
                delete_entity('trash');
                this.setState({
                    heart: this.state.heart - 1,
                    question: false,
                    answer: false
                });
                this.checkHeart();
                if (this.state.question_number != this.props.route.params.gameCard.length-1) {
                    this.setState({
                        question_number: this.state.question_number + 1
                    });
                } else {
                    isCorrect(false);
                    this.gameEngine.dispatch({ type: 'game-over' });
                    // this.props.navigation.navigate("Home");
                }
                pause_game(true);
                break;
            //if player gives right answer trash turns into nut, set question to false, and unpause game.
            case 'right-answer':
                isCorrect(true);
                this.setState({
                    question: false,
                    answer: false,
                    nut: this.state.nut+1
                });
                if (this.state.question_number != this.props.route.params.gameCard.length-1) {
                    this.setState({
                        question_number: this.state.question_number + 1
                    });
                } else {
                    isCorrect(false);
                    this.gameEngine.dispatch({ type: 'game-over' });
                    // this.props.navigation.navigate("Home");
                }
                pause_game(true);
                break;
        }
    }

    //reset game states
    reset = () => {
        this.gameEngine.swap(this.setupWorld());
        resetHeart();
        isCorrect(false);
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
        if (this.state.heart < 1) {
            this.gameEngine.dispatch({ type: 'game-over' });
        }
    }

    ///// QUESTION/ANSWER HANDLING //////////////
    // set question_text and right_answer from data
    getQuestion = (question_number) => {
        //get set of questions 
        this.setState({
            question_text: this.props.route.params.gameCard[question_number]["question"],
            right_answer: this.props.route.params.gameCard[question_number]["answer"]
        });
    }

    // get user's answer from textinput 
    getAnswer = (text) => {
        this.setState({
            your_answer: text
        });
    }

    showAnswer = () => {
        this.gameEngine.dispatch({ type: 'show-answer' });
    }

    wrongAnswer = () => {
        this.gameEngine.dispatch({ type: 'wrong-answer' });
    }

    rightAnswer = () => {
        this.gameEngine.dispatch({ type: 'right-answer' });
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
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Spiel beendet</Text>
                        <Text style={styles.home} onPress={() => {this.props.navigation.navigate("Home")}}>Home</Text>
                        <Text style={styles.retry} onPress={this.reset}>Neuer Versuch</Text>
                    </View>}

                {this.state.question &&
                    <View style={styles.fullScreen}>
                        <Text style={styles.questionText}>Frage</Text>
                        <Text style={styles.questionSubText}> {this.state.question_text} </Text>
                        <TextInput style={styles.textInput} placeholder="Deine Antwort" onChangeText={text => this.getAnswer(text)}/>
                        <Text style={styles.submitButton} onPress={this.showAnswer}>Antwort überprüfen</Text>

                    </View>}

                {this.state.answer &&
                    <View style={styles.fullScreen}>
                        <Text style={styles.answerText}>Deine Antwort:</Text>
                        <Text style={styles.answerSubText}> {this.state.your_answer} </Text>
                        <Text style={styles.ranswerText}>Richtige Antwort:</Text>
                        <Text style={styles.ranswerSubText}> {this.state.right_answer} </Text>
                        <Text style={styles.right} onPress={this.rightAnswer}>Richtig</Text>
                        <Text style={styles.wrong} onPress={this.wrongAnswer}>Falsch</Text>
                    </View>}
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
        position: 'absolute',
        borderColor: '#CCCCCC',
        backgroundColor: '#CCCCCC',
        borderTopWidth: 1,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        height: 200,
        width: 350,
        fontSize: 25,
        bottom: '25%',
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
        bottom: 0,
        left: 0,
        right: 0,
        width: 10,
        height: 10
    },
    heartCounter: {
        position: 'absolute',
        top: 40,
        bottom: 20,
        left: 40,
        right: 50,
        width: 200,
        height: 30
    },
    nutCounter_img: {
        position: 'relative',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 13,
        height: 13
    },
    nutCounter: {
        position: 'absolute',
        top: 40,
        bottom: 20,
        left: 100,
        right: 200,
        width: 200,
        height: 30
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gameOverText: {
        position: 'absolute',
        color: 'white',
        fontSize: 48,
        fontFamily: '04b_19',
        top: '30%'
    },
    gameOverSubText: {
        color: 'white',
        fontSize: 24,
        fontFamily: '04b_19'
    },
    questionText: {
        position: 'absolute',
        top: '5%',
        color: 'white',
        fontSize: 48,
        fontFamily: '04b_19'
    },
    answerText: {
        position: 'absolute',
        top: '5%',
        color: 'white',
        fontSize: 44,
        fontFamily: '04b_19'
    },
    ranswerText: {
        position: 'absolute',
        top: '45%',
        color: 'white',
        fontSize: 44,
        fontFamily: '04b_19'
    },
    questionSubText: {
        position: 'absolute',
        color: 'white',
        fontSize: 24,
        fontFamily: '04b_19',
        textAlign: 'left',
        top: '25%',
        paddingLeft: 20,
        paddingRight: 20
    },
    answerSubText: {
        position: 'absolute',
        color: 'white',
        fontSize: 24,
        fontFamily: '04b_19',
        textAlign: 'left',
        top: '25%',
        paddingLeft: 20,
        paddingRight: 20
    },
    ranswerSubText: {
        position: 'absolute',
        color: 'white',
        fontSize: 24,
        fontFamily: '04b_19',
        textAlign: 'left',
        top: '60%',
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
        textShadowOffset: { width: 2, height: 2 },
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
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        bottom: 20,
        padding: 15,
        margin: 5
    },
    right: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        bottom: 20,
        padding: 15,
        margin: 5,
        left: '15%'
    },
    wrong: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        bottom: 20,
        padding: 15,
        margin: 5,
        right: '15%'
    },
    home: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        bottom: '30%',
        padding: 15,
        margin: 5,
        fontWeight: 'bold'
    },
    retry: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        bottom: '15%',
        padding: 15,
        margin: 5,
        fontWeight: 'bold'
    },
});