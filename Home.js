import React, { Component, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Button, Image, Modal } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Game from './Game';
import { getDecktitles, getGameCards } from './src/cards/utils/api';
import bg from './src/assets/bg.png';
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
            // start Game.js
            this.mountScene(<Game data={cards}/>);

        } catch (e) {
            console.log(e);
        }      

    };

    render(){

        return(
            <View style={styles.container}>
            <Image source={bg} style={styles.backgroundImage} resizeMode="stretch" />
            <Text style={styles.title}>STUDENTEN</Text>
            <Text style={styles.title}>FUTTER</Text>
            <Image source={nut} style={styles.nut}/>

            {/* set difficulty */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={this.state.selectionDifficulty}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({selectionDifficulty:itemValue})}
                >
                    <Picker.Item label="Leicht" value="L" />
                    <Picker.Item label="Schwer" value="S" />
                </Picker>
            </View>

            {/* set deck title */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={this.state.selectionDeck}
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({selectionDeck:itemValue})}
                >{this.state.decktitle}</Picker>
            </View>

            {/* play and cards buttons */}
            <View style={styles.buttonContainer}  sceneVisible={this.state.sceneVisible}>
                <Button style={styles.buttons} color='#35916b'
                    onPress={ _ => {
                        this.handleStartGame();
                    }}
                    title="Spielen"
                />
                <Image source={squirrel} style={styles.squirrel}/>
                <Button color='#35916b'
                    onPress={ () => {
                        this.props.navigation.navigate("Karteikarten");
                    }}
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
        
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#41c48e',
    },
    title: {
        top: 40,
        fontSize: 50,
        color: '#35916b',
        textAlign: 'center'
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
    separator: {
        marginVertical: 20,
        borderBottomColor: 'rgb(176,226,255)',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    pickerContainer: {
        //paddingTop: 10,
        marginTop: 5,
        alignItems: "center"
      }
});