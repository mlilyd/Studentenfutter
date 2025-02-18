import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

//importing other files and libs
import Constants from '../Constants.js'; //setup some fixed properties in the file
import {GameEngine} from 'react-native-game-engine'; //game engine for our app

//importing actual objects, these components are used to display different spaces on the screen
import Bird from '../components/Squirrel.js';
import Floor from '../components/Floor.js';

//importing physics that are created to make the world interactive, has settings that make the world feel real
import {
  stopGame,
  startGame,
  GameControl,
} from '../components/Physics.js';

import Styles from '../Styles.js';

export default class Play extends PureComponent {
  constructor(props) {
    super(props);
    this.gameEngine = null;
    this.entities = this.setupWorld();

    this.state = {
      running: true,
      score: 0,
      uid: auth().currentUser.uid,
    };
  }

  componentDidMount() {
    SoundPlayer.loadSoundFile('point', 'wav');
    SoundPlayer.loadSoundFile('hit', 'wav');
  }

  setupWorld = () => {
    startGame();

    let bird = [Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2];

    let floor1 = [0, Constants.MAX_HEIGHT - Constants.FLOOR_HEIGHT];
    let floor2 = [
      Constants.MAX_WIDTH,
      Constants.MAX_HEIGHT - Constants.FLOOR_HEIGHT,
    ];

    return {
      1: {position: bird, renderer: <Bird />, name: 'bird', pose: 0},
      2: {position: floor1, renderer: <Floor />, name: 'floor'},
      3: {position: floor2, renderer: <Floor />, name: 'floor'}
    };
  };


  //reset the game to play again
  reset = () => {
    startGame();
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      score: 0,
    });
  };

  renderGame = () => {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/bg.png')}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />
        <GameEngine
          ref={ref => {
            this.gameEngine = ref;
          }}
          style={StyleSheet.gameContainer}
          systems={[GameControl]}
          entities={this.entities}
          onEvent={this.onEvent}
          running={this.state.running}
        />
        <Text style={[styles.score, Styles.fontExtraLarge]}>
          {this.state.score}
        </Text>
        {!this.state.running && (
          <View style={styles.fullScreen}>
            <Text style={[styles.gameOverText, Styles.fontExtraLarge]}>
              Game Over
            </Text>
            <TouchableOpacity onPress={this.reset}>
              <Text style={[styles.gameOverSubText, Styles.fontMedium]}>
                Try Again
              </Text>
            </TouchableOpacity>
            <View style={{position: 'absolute', bottom: 10}}>
              <TouchableOpacity
                onPress={() => {
                  this.reset();
                  this.props.navigation.goBack();
                }}>
                <Text style={[styles.closeBtn, Styles.fontLarge]}>x</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    return this.renderGame();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  score: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'cusFont',
    top: 30,
    alignSelf: 'center',
    textShadowColor: '#444444',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
    zIndex: 100,
  },
  fullScreen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0, 0.8)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: 'white',
    fontFamily: 'cusFont',
  },
  gameOverSubText: {
    color: 'white',
    fontFamily: 'cusFont',
  },
  closeBtn: {
    color: 'white',
    fontFamily: 'cusFont',
  },
});