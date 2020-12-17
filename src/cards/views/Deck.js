
import React, {useEffect} from 'react';
import { StyleSheet,  View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import { removeDeck, removeCard } from '../utils/api';
import * as actions from '../store/actions/decks'
import { Button, Text, Card } from 'native-base';

const Deck = props => {
  const { handleGetAllDecks, decks, selectedDeck, deleteDeck, deleteCard, navigation, selectDeck } = props;
  const deck = decks.filter(deck => deck.id === selectedDeck)[0]


  // source: https://reactnative.dev/docs/alert
  // add warning alerts before deleting card or deck

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
  
  const deletionDeck = () =>
  Alert.alert(
    "Karteikartenset löschen",
    "Möchten Sie dieses Karteikartenset wirklich löschen?",
    [
      { 
        text: "Ja", 
        onPress: () => handleDeleteDeck()
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
    navigation.navigate('Karteikarten')
  } 

  if (deck === undefined) return null;
  
  // added deletion of a card
  const handleDeleteCard = (index) => {
    deleteCard(selectedDeck, index)
    removeCard(selectedDeck, index)
    // delete deck.questions[index]
    selectDeck('')
    navigation.navigate('Karteikarten')
  }

  return (
    // added scrollview
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
        <Button style={styles.buttons} block ligh title='Add new card' onPress={() => navigation.navigate('Karteikarte hinzufügen')}>
          <Text style={styles.buttonText}>Karteikarte hinzufügen</Text>
        </Button>
        <Button style={styles.buttons} block ligh title='Delete Deck' onPress={deletionDeck}>
          <Text style={styles.buttonText}>Karteikartenset löschen</Text>
        </Button>
        {/* display of all cards and deletion option added.
            removed prior quiz button and number of cards display */}
        <View>{deck.questions.map((object, index) => (
          <View key={index} style={styles.cardsFrame}>
            <Button style={styles.buttonsDelete} title='Delete card' onPress={() => deletionWarn(index)}><Text style={styles.buttonTextX}>X</Text></Button>
            <Text style={styles.cardtext}>{index+1}. Frage: {object.question + " "}</Text> 
            <Text style={styles.cardtext}>Antwort: {object.answer}</Text>
            <Text style={styles.cardtextDiff}>Schwierigkeit: {object.difficulty}</Text>
          </View>))}
        </View>
        </View>
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
    textAlign: 'center',
    margin: 20,
    //marginTop: 80,
    color: '#308260',
    fontWeight: 'bold'
  },
  buttons: {
    backgroundColor: '#308260',
    margin: 5,
    marginBottom: 20,
    //height: "10%",
    fontSize: 62,
    fontWeight: '600',
    textAlign: 'center'
    //backgroundColor: 'rgb(00,161,200)'
  },
  buttonsDelete: {
    borderRadius: 8,
    backgroundColor: '#308260',
    margin: 5,
    marginLeft: "85%",
    fontWeight: 'bold'
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonTextX: {
    fontSize: 18
  },
  cardsFrame: {
    margin: 15,
    padding: 2,
    backgroundColor: '#d4f6f8'
  },
  subtitle: {
    fontSize: 32,
    textAlign: 'center',
    margin: 20,
    color: '#CC3300'
  },
  cardtext: {
    //padding: 1,
    fontSize: 22,
    textAlign: 'center',
    margin: 5
  },
  cardtextDiff: {
    //padding: 1,
    fontSize: 22,
    textAlign: 'right',
    margin: 5,
    color: 'grey'
  }
});
