import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Button, Alert, TouchableOpacity, Image, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Game from './Game';
import Cards from './Cards';
import { store } from './src/cards/store';
import { Provider } from 'react-redux';


export default class App extends Component{
    constructor(props){
        super(props) 
        const navigation = props;
        this.state = {
            sceneVisible: false,
            scene: null
          };
        }
        
        mountScene = scene => {
            this.setState({
              sceneVisible: true,
              scene: scene
            });
          };
        
        unMountScene = () => {
        this.setState({
            sceneVisible: false,
            scene: null
        });
        };
        
            
    render(){
        return(
            <View style={styles.container}>

            {/* <TouchableOpacity style={styles.button} onPress={this.mountScene(<Game />)}><Text>press</Text></TouchableOpacity> */}

                <View style={styles.buttonContainer}  sceneVisible={this.state.sceneVisible}>
                <Button style={styles.buttons} color='#35916b'
                    onPress={ _ => navigation.navigate('Game')}
                    title="Spielen"
                />
                <View style={styles.separator} />
                <Button color='#35916b'
                    onPress={() => navigation.navigate('Cards')}
                    title="Karteikarten"
                />
                </View>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.sceneVisible}
                    onRequestClose={_ => {}}
                    >
                    {this.state.scene}

                    {/* <CloseButton onPress={this.unMountScene} /> */}
                </Modal>
                
            </View>

            

    //     <div>
    //     <Button onClick={this._onButtonClick} title="Press"/>
    //     {this.state.showComponent ?
    //        <Game /> :
    //        null
    //     }
    //   </div>

        // <View style={styles.container}>
        //     <View style={styles.buttonContainer}>
        //         <Game />
        //       {/* <Button
        //         onPress={() => {
        //             var game = new Game();
        //             alert('You tapped the button!');
        //         }}
        //         title="Spielen"
        //         /> */}
        //     </View>
        //     <View style={styles.buttonContainer}>
        //       <Button
        //         onPress={() => {
        //             alert('You tapped button!');
        //         }}
        //         title="Karteikarten"
        //         />
        //     </View>
        // </View>
        
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#41c48e',
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
    },
    buttonContainer: {
        top: 200
    },
    separator: {
        marginVertical: 20,
        borderBottomColor: '#41c48e',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
});
  
//   export default App;