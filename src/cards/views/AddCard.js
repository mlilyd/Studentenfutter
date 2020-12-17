
import React, {useEffect, useState} from 'react';
import { StyleSheet,  View, TextInput  } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import * as actions from '../store/actions/decks'
import {  Button, Text, Card, Radio } from 'native-base';
import { Picker } from '@react-native-community/picker';

const AddCard = ({ handleAddCardToDeck, selectedDeck, navigation })=> {

    const [difficulty, setSelectedValue] = useState("L");
    const [question, onChangeQuestion] = useState('Frage')
    const [answer, onChangeAnswer] = useState('Antwort')

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
            <Text style={styles.puretext}>Kartenschwierigkeit: </Text>
            {/* https://reactnative.dev/docs/picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={difficulty}
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Leicht" value="L" />
                    <Picker.Item label="Schwer" value="S" />
                </Picker>
            </View>
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
        backgroundColor: '#d4f6f8'
    },
    puretext: {
        fontSize: 22,
        marginLeft: 20
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
        borderBottomColor: 'grey',
        borderBottomWidth: 1.5,
        marginTop: 30,
        marginBottom: 30,
        color: 'rgb(64,64,64)'
    },
    pickerContainer: {
        //paddingTop: 10,
        marginTop: 5,
        alignItems: "center",
        backgroundColor: 'white',
        marginHorizontal: 80,
        marginBottom: 15
    }
});

