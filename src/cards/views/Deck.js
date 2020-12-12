
import React, {useEffect} from 'react';
import { StyleSheet,  View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import { removeDeck, removeCard } from '../utils/api';
import * as actions from '../store/actions/decks'
import { Button, Text, Card } from 'native-base';
import { Render } from 'matter-js';

const Deck = props => {
  const { handleGetAllDecks, decks, selectedDeck, deleteDeck, deleteCard, navigation, selectDeck } = props;
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

  // source: https://reactnative.dev/docs/alert
  const deletionWarn = (index) =>
  Alert.alert(
    "Karteikarte löschen",
    "Möchten Sie Karteikarte " + (index + 1) + " löschen?",
    [
      { 
        text: "Ja", 
        onPress: () => handleDeleteCard(index)
      },
      {
        text: "Nein",
        style: "cancel"
      }
    ],
    { cancelable: false }
  );

  

  const handleDeleteDeck = () => {
    deleteDeck(selectedDeck)
    removeDeck(selectedDeck)
    selectDeck('')
    navigation.navigate('CardsHome')
  } 
  console.log(deck)
  if (deck === undefined) return null;
  
  const handleDeleteCard = (index) => {
    deleteCard(selectedDeck, index)
    removeCard(selectedDeck, index)
    // delete deck.questions[index]
    selectDeck('')
    navigation.navigate('CardsHome')
  }

  return (
    // Scrollview added
    <ScrollView
  contentContainerStyle={{
    minHeight: 10,
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 16,
  }}
  alwaysBounceVertical={false}
  showsVerticalScrollIndicator={true}
>
      <Card style={{ height: '100%' }}>
        <View style={{flex: 1}}>
        <Text style={styles.header}>{deck.title}</Text>
        {/* display of all cards and deletion option added.
            removed prior quiz button and number of cards display */}
        <View>{deck.questions.map((object, index) => (
          <View key={index} style={styles.cardsFrame}>
            <Text style={styles.cardtextQuestion}>{index+1}. Frage: {object.question + " "}</Text> 
            <Text style={styles.cardtextAnswer}>Antwort: {object.answer}</Text>
            <Button style={styles.buttonsDelete} block ligh title='Delete card' onPress={() => deletionWarn(index)}><Text>X</Text></Button>
          </View>))}
        </View>
        <Button style={styles.buttons} block ligh title='Add new card' onPress={() => navigation.navigate('AddCard')}>
          <Text style={styles.buttonText}>Add Card</Text>
        </Button>
        <Button style={styles.buttons} block ligh title='Delete Deck' onPress={handleDeleteDeck}>
          <Text style={styles.buttonText} >Delete Deck</Text>
        </Button></View>
        {/* <Text style={styles.subtitle}>{deck.questions.length} cards</Text> */}
        </Card>
    </ScrollView>
  );
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch)

export default compose(connect(mapStateToProps, mapDispatchToProps))(Deck)

const styles = StyleSheet.create({
  container: {
    height: '90%'
  },
  header: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    margin: 30,
    //marginTop: 80,
    color: '	rgb(64,64,64)',
  },
  buttons: {
    margin: 5,
    //height: "10%",
    fontSize: 62,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonsDelete: {
    backgroundColor: 'rgb(00,191,200)',
    //margin: 5,
    marginLeft: 150,
    marginRight: 150,
    //height: "10%",
    //fontSize: 6,
    fontWeight: '600',
    //textAlign: 'left',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  cardsFrame: {
    margin: 3,
    padding: 2,
    borderColor: 'rgb(0,191,200)',
    borderWidth: 2,
    borderStyle: "solid"
  },
  subtitle: {
    fontSize: 32,
    textAlign: 'center',
    margin: 20,
    color: '#CC3300'
  },
  cardtextQuestion: {
    //padding: 1,
    fontSize: 10,
    textAlign: 'center',
    margin: 10
  },
  cardtextAnswer: {
    //padding: 1,
    fontSize: 10,
    textAlign: 'center',
    margin: 10
  }
});
