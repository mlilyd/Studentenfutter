
import React, {useEffect} from 'react';
import { StyleSheet,  View, ScrollView, SafeAreaView } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import { removeDeck } from '../utils/api';
import * as actions from '../store/actions/decks'
import { Button, Text, Card } from 'native-base';
import { Render } from 'matter-js';

const Deck = props => {
  const { handleGetAllDecks, decks, selectedDeck, deleteDeck, navigation, selectDeck } = props;
  const deck = decks.filter(deck => deck.id === selectedDeck)[0]
  // const cards = deck.questions.map((i) => (i.question + " " + i.answer + "\n")) 
  // const del_card = 

  // function cardsDel() {
  //   var test = "";
  //   for (let i = 0; i < (deck.questions.length-1); i++){
  //     test += <Text style={styles.cardtext}>{deck.questions[i].question + deck.questions[i].answer}</Text>;
  //   }
  //   return test;
  // }

  const handleDeleteDeck = () => {
    deleteDeck(selectedDeck)
    removeDeck(selectedDeck)
    selectDeck('')
    navigation.navigate('CardsHome')
  } 
  console.log(deck)
  if (deck === undefined) return null;
  
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <Card style={{ height: '100%' }}>
        <Text style={styles.header}>{deck.title}</Text>
        <View>{deck.questions.map((object, index) => (
          <View>
            <Text style={styles.cardtext}>{object.question + " " + object.answer}</Text> 
            <Button style={styles.buttons} block ligh title='Delete card' onPress={() => alert("hi, delete " + index)}><Text>X</Text></Button>
          </View>))}
        </View>
        {/* <Text style={styles.subtitle}>{deck.questions.length} cards</Text> */}
        <Button style={styles.buttons} block ligh title='Add new card' onPress={() => navigation.navigate('AddCard')}>
          <Text style={styles.buttonText}>Add Card</Text>
        </Button>
        <Button style={styles.buttons} block ligh title='Delete Deck' onPress={handleDeleteDeck}>
          <Text style={styles.buttonText} >Delete Deck</Text>
        </Button>
      </Card>
    </ScrollView>
    </SafeAreaView>

  );
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch)

export default compose(connect(mapStateToProps, mapDispatchToProps))(Deck)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    fontSize: 42,
    fontWeight: '600',
    textAlign: 'center',
    margin: 30,
    marginTop: 80,
    color: '	rgb(64,64,64)',
  },
  buttons: {
    margin: 5,
    height: "10%",
    fontSize: 62,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 23,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 32,
    textAlign: 'center',
    margin: 20,
    color: '#CC3300'
  },
  cardtext: {
    fontSize: 10,
    margin: 10
  }
});
