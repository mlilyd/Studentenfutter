import React, { Component, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Button, Alert, TouchableOpacity, Image, Modal } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Game from './Game';
import Cards from './Cards';
import AsyncStorage from "@react-native-community/async-storage";
import { setPicker } from './src/cards/utils/api';
import bg from './src/assets/bg.png';
import squirrel from './src/assets/squirrel_3.png';
import nut from './src/assets/nut.png';

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sceneVisible: false,
            scene: null,
            selection: "test"
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

    render() {

        return (
            <View style={styles.container}>
                <Image source={bg} style={styles.backgroundImage} resizeMode="stretch" />
                <Text style={styles.title}>STUDENTEN</Text>
                <Text style={styles.title}>FUTTER</Text>
                <Image source={nut} style={styles.nut} />

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={this.state.selection}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue, itemIndex) => this.setState({ selection: itemValue })}
                    >
                        <Picker.Item label="S" value="S" />
                        <Picker.Item label="L" value="L" />
                    </Picker>
                </View>

                <View style={styles.buttonContainer} sceneVisible={this.state.sceneVisible}>
                    <Button style={styles.buttons} color='#35916b'
                        onPress={_ => {
                            this.mountScene(<Game />);
                        }}
                        title="Spielen"
                    />
                    <Image source={squirrel} style={styles.squirrel} />
                    <Button color='#35916b'
                        onPress={_ => {
                            this.mountScene(<Cards />)
                        }}
                        title="Karteikarten"
                    />
                </View>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.sceneVisible}
                    onRequestClose={_ => { }}
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
    title: {
        top: 90,
        fontSize: 50,
        fontFamily: 'Century Gothic',
        color: 'rgb(100,185,255)',
        textAlign: 'center'
    },
    squirrel: {
        top: 210,
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
    buttonContainer: {
        top: 20
    },
    separator: {
        marginVertical: 20,
        borderBottomColor: 'rgb(176,226,255)',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    pickerContainer: {
        paddingTop: 40,
        alignItems: "center"
    }
});

//   export default App;