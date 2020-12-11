import React, { useEffect} from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { store } from './src/cards/store';
import { Provider } from 'react-redux';

import Deck from './src/cards/views/Deck';
import CardsHome from './src/cards/views/CardsHome';
import AddCard from './src/cards/views/AddCard';
import AddDeck from './src/cards/views/AddDeck';

/*const Stack = createStackNavigator()

export default function Cards(){
    
    return (
        <Provider store={store}>
    
        <NavigationContainer>
          <Stack.Navigator style={styles.container}>
              <Stack.Screen name="CardsHome" component={CardsHome} />
              <Stack.Screen name="Deck" component={Deck} />
              <Stack.Screen name="AddCard" component={AddCard} />
              <Stack.Screen name="AddDeck" component={AddDeck} />
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
       
*/
