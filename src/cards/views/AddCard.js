
import React, {useEffect, useState} from 'react';
import { StyleSheet,  View, TextInput  } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import * as actions from '../store/actions/decks'
import {  Button, Text, Card, Radio } from 'native-base';
import { Picker } from '@react-native-community/picker';


const AddCard = ({ handleAddCardToDeck, selectedDeck, navigation })=> {
    const [question, onChangeQuestion] = useState('Frage')
    const [answer, onChangeAnswer] = useState('Antwort')
    const [difficulty, onChangeDifficulty] = useState('')

    const handleAddCard = () => {
        handleAddCardToDeck(selectedDeck, {question, answer, difficulty})
        navigation.navigate('gewähltes Karteikartenset')
    }
  
  return (
    <View style={styles.container}>
          <TextInput style={styles.input} title='What is the title of your card?' onChangeText={text => onChangeQuestion(text)}
              value={question} />
          <TextInput style={styles.input} title='What is the answer of your card?' onChangeText={text => onChangeAnswer(text)}
      value={answer}/>
          <Text style={styles.puretext}>Ordnen Sie diese Karteikarte als Leicht (L) oder Schwierig (S) ein? Bitte nur einen Buchstaben eingeben.</Text>
          <View style={styles.pickerContainer}>
                <Picker
                    //selectedValue={this.state.difficulty}
                    //style={{ height: 50, width: 150 }}
                    //onValueChange={(itemValue, itemIndex) => this.setState({difficulty:itemValue})}
                >
                    <Picker.Item label="Leicht" value="L" />
                    <Picker.Item label="Schwer" value="S" />
                </Picker>
            </View>
          <TextInput style={styles.input} title='What is the difficulty of your card?' onChangeText={text => onChangeDifficulty(text)} 
                value={difficulty}/>
          <Button block light style={styles.buttons} onPress={handleAddCard} >
          <Text style={styles.titles} >Neue Karteikarte hinzufügen</Text>
          </Button>
    </View>
  );
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch)

export default compose(connect(mapStateToProps, mapDispatchToProps))(AddCard)

const styles = StyleSheet.create({
    container: {
        marginTop: 0
    },
    buttons: {
        margin: 15,
        fontSize: 92,
        height: 100,
        fontWeight: '600',
        textAlign: 'center',
        backgroundColor: 'rgb(198,226,255)'
    },
    puretext: {
        fontSize: 12
    },
    titles: {
        fontWeight: '600',
        fontSize: 28,
        textAlign: 'center',
        margin: 10,
        color: 'rgb(64,64,64)'
    },
    input: {
        alignContent: 'center',
        fontSize: 28,
        textAlign: 'center',
        borderBottomColor: 'rgb(64,64,64)',
        borderBottomWidth: 1.5,
        marginBottom: 30,
        color: 'rgb(64,64,64)'
    }
});

