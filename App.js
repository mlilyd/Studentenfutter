import React, { Component, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Button, Alert, TouchableOpacity, Image, Modal } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { store } from './src/cards/store';
import { Provider } from 'react-redux';

import Home from './Home';
import Game from './Game';
import Deck from './src/cards/views/Deck';
import CardsHome from './src/cards/views/CardsHome';
import AddCard from './src/cards/views/AddCard';
import AddDeck from './src/cards/views/AddDeck';

const Stack = createStackNavigator()

export default function Cards() {
    
    return (
        <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator style={styles.container}>
              <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
              <Stack.Screen name="Game" component={Game} options={{headerShown: false}} />
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
       

