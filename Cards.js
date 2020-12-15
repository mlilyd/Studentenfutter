import React, { Component, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Button, Alert, TouchableOpacity, Image, Modal } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { store } from './src/cards/store';
import { Provider } from 'react-redux';

import Deck from './src/cards/views/Deck';
import CardsHome from './src/cards/views/CardsHome';
import AddCard from './src/cards/views/AddCard';
import AddDeck from './src/cards/views/AddDeck';

// import App from './App';
import bg from './src/assets/bg.png';

const Stack = createStackNavigator()

export default function Cards(){
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
    
    return (
        <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator style={styles.container}>
              <Stack.Screen name="Karteikarten" component={CardsHome} />
              <Stack.Screen name="gewähltes Karteikartenset" component={Deck} />
              <Stack.Screen name="Karteikarte hinzufügen" component={AddCard} />
              <Stack.Screen name="Karteikartenset hinzufügen" component={AddDeck} />
          </Stack.Navigator>
        </NavigationContainer>
    
        </Provider>
      );

    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
      },
    });
       

