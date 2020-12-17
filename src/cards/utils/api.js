import AsyncStorage from "@react-native-community/async-storage";

const FLASHCARDS_STORAGE_KEY = "flashcards_data";

// changed initialData according to our needs
function initialData() {
  return {
    "sxbjgrwdbhf58lxznh9q79": {
      id: "sxbjgrwdbhf58lxznh9q79",
      title: "Hauptstädte",
      questions: [
        {
          question: "Was ist die Hauptstadt von Deutschland?",
          answer: "Berlin",
          difficulty: "L" // added difficulty for each card!
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
        },
        {
          question: "Was ist die Hauptstadt von Nicaragua?",
          answer: "Managua",
          difficulty: "S"
        },
        {
          question: "Was ist die Hauptstadt von Honduras?",
          answer: "Tegucigalpa",
          difficulty: "S"
        },
        {
          question: "Was ist die Hauptstadt von Estland?",
          answer: "Tallinn",
          difficulty: "S"
        },
        {
          question: "Was ist die Hauptstadt von Ungarn?",
          answer: "Budapest",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Schweden?",
          answer: "Stockholm",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Österreich?",
          answer: "Wien",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Griechenland?",
          answer: "Athen",
          difficulty: "L"
        },
        {
          question: "Was ist die Hauptstadt von Ghana?",
          answer: "Accra",
          difficulty: "S"
        },
        {
          question: "Was ist die Hauptstadt von Nigeria?",
          answer: "Abuja",
          difficulty: "S"
        },
        {
          question: "Was ist die Hauptstadt von Italien?",
          answer: "Rom",
          difficulty: "L"
        }
      ]
    },
    "636jgrwdbhf58lxznh9q79": {
      id: "636jgrwdbhf58lxznh9q79",
      title: "Verschiedenes", //source: Internet :)
      questions: [
        {
          question: "In welchem Jahr wurde Mozart geboren?",
          answer: "1756",
          difficulty: "S"
        },
        {
          question: "Wie viele Kontinente gibt es?",
          answer: "7",
          difficulty: "L"
        },
        {
          question: "Wie 'lang' ist ein erwachsener Maulwurf ca.?",
          answer: "13cm",
          difficulty: "S"
        },
        {
          question: "Wie groß war Goethe?",
          answer: "1,69m",
          difficulty: "S"
        },
        {
          question: "In welchem Ort kam Einstein zur Welt?",
          answer: "Ulm",
          difficulty: "S"
        },
        {
          question: "In welchem Jahr wurde das erste Harry Potter Buch veröffentlicht?",
          answer: "1997",
          difficulty: "S"
        },
        {
          question: "Welcher Planet ist der Sonne am nächsten?",
          answer: "Merkur",
          difficulty: "L"
        },
        {
          question: "Was für ein Fisch ist Nemo aus 'Findet Nemo'?",
          answer: "Ein Clownfisch",
          difficulty: "L"
        },
        {
          question: "Wie viele Kugeln kommen beim Billiard zum Einsatz?",
          answer: "16 = 15 + 1 (15 Spielkugeln und der weiße Spielball)",
          difficulty: "L"
        },
        {
          question: "Wie viele Tage hat der Juli",
          answer: "31",
          difficulty: "L"
        }
      ]
    },
    "632mgp7hm68vzvg2amz1hq": {
      id: "632mgp7hm68vzvg2amz1hq",
      title: "Mathe",
      questions: [
        {
          question: "Was ergibt 4 + 18?",
          answer: "22",
          difficulty: "L"
        },
        {
          question: "Was ist die Wurzel aus 49?",
          answer: "7",
          difficulty: "L"
        },
        {
          question: "Was ist die Wurzel aus 256?",
          answer: "16",
          difficulty: "L"
        },
        {
          question: "Was ergibt 40 + 12?",
          answer: "52",
          difficulty: "L"
        },
        {
          question: "Was ergibt 1 + 1?",
          answer: "2",
          difficulty: "L"
        },
        {
          question: "Was ist die Wurzel aus 625?",
          answer: "25",
          difficulty: "S"
        },
        {
          question: "Was ergibt 17*16?",
          answer: "272",
          difficulty: "S"
        },
        {
          question: "Was ergibt 984/12?",
          answer: "82",
          difficulty: "S"
        },
        {
          question: "Was ist die dritte Wurzel aus 125?",
          answer: "5",
          difficulty: "S"
        },
        {
          question: "Was ergibt 152/19?",
          answer: "8",
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

// -------------------------------------------------------- MANUALLY ADDED FUNCTIONS --------------------------------------------------------

// remove a single card from the selected deck
export async function removeCard(deckId, index) {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  if (results) {
    const data = JSON.parse(results);
    
    for (i=0; i<data[deckId]["questions"].length; i++) {
      if (i == index) {
        // if i is index to delete, splice question array so it disappears
        data[deckId]["questions"].splice(i, 1);
      }
    };

    // change item in AsyncStorage according to new object
    await AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(data));

    return data;
  }
  return {};
}

// get all titles of decks
export async function getDecktitles() {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  var decktitles = [];

  if (results && results !== '{}') {
    var data = JSON.parse(results);

    // https://stackoverflow.com/questions/5223/length-of-a-javascript-object
    // get "size" of object with number of keys
    Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    }

    for (i=0; i<Object.size(data); i++) {
      // get all titles of decks and add them to array
      decktitles.push(Object.values(data)[i]["title"]);
    }
    return decktitles;
  }

  return {};
}

// get n cards according to difficulty and deck set by user to play the game!
export async function getGameCards(difficulty, decktitle) {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  var gameCards = [];
  var n = 0;

  if (results && results !== '{}') {
    var data = JSON.parse(results);

    // https://stackoverflow.com/questions/5223/length-of-a-javascript-object
    // get "size" of object with number of keys
    Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    }

    // get possible cards that fit user selection (decktitle and difficulty)
    for (i=0; i<Object.size(data); i++) {
      for (j=0; j<Object.size(Object.values(data)[i]["questions"]); j++) {
        if (Object.values(data)[i]["title"] == decktitle && Object.values(data)[i]["questions"][j]["difficulty"] == difficulty) {
          gameCards.push(Object.values(data)[i]["questions"][j]);
        }   
      }
    }

    console.log("MATCHING CARDS: \n", gameCards, "\n");
    
    // take n random elements of gameCards array to play the game
    // for now: n = 3 to see if it works
    if (gameCards.length < 3) {
      return gameCards;
    } else {
      // https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array/38571132#38571132
      let randomGameCards = gameCards.sort(() => .5 - Math.random()).slice(0,3)
      console.log("N CARDS OF MATCHING CARDS: \n", randomGameCards, "\n");
      return randomGameCards;
    }
  }
}