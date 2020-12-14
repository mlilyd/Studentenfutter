import AsyncStorage from "@react-native-community/async-storage";
// import { generateUID } from "./helper";

const FLASHCARDS_STORAGE_KEY = "flashcards_data";

function initialData() {
  return {
    sxbjgrwdbhf58lxznh9q79: {
      id: "sxbjgrwdbhf58lxznh9q79",
      title: "Hauptstädte",
      questions: [
        {
          question: "Was ist die Hauptstadt von Deutschland?",
          answer: "Berlin",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Frankreich?",
          answer: "Paris",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Belgien?",
          answer: "Brüssel",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt der Niederlande?",
          answer: "Amsterdam",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Portugal?",
          answer: "Lissabon",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Madagaskar?",
          answer: "Antananarivo",
          difficulty: "S"
        }
      ]
    }
  };
}

export async function getDecks() {
  try {
    const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
    if (results && results !== '{}'){
       const data = JSON.parse(results);
     return data;
     } else {
      await AsyncStorage.setItem(
        FLASHCARDS_STORAGE_KEY,
        JSON.stringify(initialData())
      );
      return initialData();
    }
  } catch (error) {
    await AsyncStorage.setItem(
      FLASHCARDS_STORAGE_KEY,
      JSON.stringify(initialData())
    );
    return initialData();
  }
}

export function generateUID() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}


export async function saveDeckTitle(title) {
  const id = generateUID();
  const deck = {
    id: id,
    title: title,
    questions: []
  };

  await AsyncStorage.mergeItem(
    FLASHCARDS_STORAGE_KEY,
    JSON.stringify({
      [id]: deck
    })
  );
  return deck;
}

export async function saveCardToDeck(deckId, card) {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  if (results) {
    const data = JSON.parse(results);
    const deck = data[deckId];
    deck.questions = deck.questions.concat([card]);
    await AsyncStorage.mergeItem(
      FLASHCARDS_STORAGE_KEY,
      JSON.stringify({
        [deckId]: deck
      })
    );
    return card;
  }
}

export async function removeDeck(deckId) {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  if (results) {
    const data = JSON.parse(results);
    delete data[deckId];

    await AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  return {};
}

export async function removeCard(deckId, index) {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  if (results) {
    const data = JSON.parse(results);
    
    for (i=0; i<data[deckId]["questions"].length; i++) {
      if (i == index) {
        data[deckId]["questions"].splice(i, 1);
      }
    };

    await AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(data));

    return data;
  }
  return {};

}
