/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';
import Squirrel from './src/Squirrel';
import Constants from './src/Constants';

export default class App extends Component {
    constructor(props){
      super(props);

      this.state = {
        running: true
      };
      this.gameEngine = null;
      this.entities = this.setupWorld();

    }

    setupWorld = () => {
      let engine = Matter.Engine.create({
        enableSleeping: false
      });
      let world = engine.world;
      let squirrel = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2, 50, 50);

      Matter.World.add(world, [squirrel]);

      return {
        physics: { engine: engine, world: world },
        squirrel: { body: squirrel, size: [50,50], color: 'red', renderer: Squirrel},
      }
    }

    render() {
      return (
        <View style={StyleSheet.container}>
          <GameEngine 
          ref={(ref) => { this.gameEngine = ref; }}
          style={styles.gameContainer}
          running={this.state.running}
          entities={this.entities}>
          </GameEngine>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  gameContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
  },

});
