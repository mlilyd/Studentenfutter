import React, { Component, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Button, Image, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Game from './Game';
import { getDecktitles, getGameCards } from './src/cards/utils/api';
import homebg from './src/assets/homebg.png';
import squirrel from './src/assets/squirrel_3.png';
import nut from './src/assets/nut.png';

export default class Home extends Component{
    constructor(props){
        super(props) 

        this.state = {
            sceneVisible: false,
            scene: null,
            selectionDifficulty: "L",
            selectionDeck: "Hauptstädte",
            decktitle: null
          };

        this.decktitles = this.setPicker();
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

    // call to set picker/selection dynamically according to decks in storage
    setPicker = async () => {
        try {
            // get dynamic deck titles
            var decktitles = await getDecktitles();
            // https://stackoverflow.com/questions/47658765/objects-are-not-valid-as-a-react-child-found-object-promise/47659112
            // dynamically fill picker
            this.setState({
                decktitle: decktitles.map((object, index) => (
                    <Picker.Item key={index} label={object} value={object}/>
                ))
            });

        } catch (e) {
            console.log(e);
        }      
    };

    // call when pressing "Spielen", right before game will start
    handleStartGame = async () => {
        try {
            // get user chosen cards to play the game
            var cards = await getGameCards(this.state.selectionDifficulty, this.state.selectionDeck);
            // https://www.pluralsight.com/guides/how-to-send-state-of-current-component-as-a-parameter-to-another-external-method-using-react
            // add cards to <Game /> and access them in class
            // this.mountScene(<Game data={cards}/>);

            // start Game.js
            this.props.navigation.navigate("Game", {gameCard: cards});

        } catch (e) {
            console.log(e);
        }      

    };

    render(){

        return(
            <View style={styles.container}>
            <Image source={homebg} style={styles.backgroundImage} resizeMode="stretch" />
            <Text style={styles.title}>STUDENTEN</Text>
            <Text style={styles.title}>FUTTER</Text>

            {/* set difficulty */}
            <View style={styles.pickerContainer}>
                <Text style={{paddingRight:50, paddingLeft:10, fontSize:16}}>Schwierigkeit:</Text>
                <Picker
                    selectedValue={this.state.selectionDifficulty}
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({selectionDifficulty:itemValue})}
                >
                    <Picker.Item label="Leicht" value="L" />
                    <Picker.Item label="Schwer" value="S" />
                </Picker>
            </View>

            {/* set deck title */}
            <View style={styles.pickerContainer2}>
                <Text style={{paddingRight:74, paddingLeft:10, fontSize:16}}>Kartenset:</Text>
                <Picker
                    selectedValue={this.state.selectionDeck}
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({selectionDeck:itemValue})}
                >{this.state.decktitle}</Picker>
            </View>

            {/* play and cards buttons */}
            <View style={styles.buttonContainer}  sceneVisible={this.state.sceneVisible}>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={ _ => {
                        this.handleStartGame();
                    }}
                >
                    <Text style={styles.buttontext}>SPIELEN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttons}
                    onPress={ _ => {
                        this.props.navigation.navigate("Karteikarten");
                    }}
                >
                    <Text style={styles.buttontext}>KARTEIKARTEN</Text>
                </TouchableOpacity>

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
        
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#41c48e',
    },
    buttons: {
        backgroundColor: '#308260',
        height: 70,
        marginBottom: 20,
        //height: "10%",
        fontSize: 62,
        fontWeight: '600',
        textAlign: 'center',
        //backgroundColor: 'rgb(00,161,200)',
        justifyContent: 'center',
        alignItems: "center",
        padding: 10
    },
    buttontext: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold'
    },
    title: {
        top: 40,
        fontSize: 50,
        color: '#35916b',
        textAlign: 'center',
        fontFamily: 'serif',
        fontWeight: 'bold'
    },
    squirrel: {
        top: 190,
        left: 250
    },
    nut: {
        top: 390,
        left: 300
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
    buttonContainer: {
        top: 20
    },
    pickerContainer: {
        //margin: 15,
        flexDirection: 'row',
        height: 30,
        //paddingTop: 10,
        //marginLeft: 50,
        //marginRight: 60,
        backgroundColor: 'white',
        marginTop: 60,
        alignItems: "center"
      },
    pickerContainer2: {
        flexDirection: 'row',
        height: 30,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 5,
        alignItems: "center"
      }
});