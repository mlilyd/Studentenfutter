# PSeL Projekt 1: Studentenfutter
Der Prototyp einer App, die Karteikarten und Jump 'n' Run-Spiel vereint. 

## App herunterladen und starten
Auf dem Entwicklungs-Endgerät sollte das [React Native development environment](https://reactnative.dev/docs/environment-setup) vorhanden sein. Schließlich kann die App nach dem Herunterladen und via Verbindung zu einem physischen oder virtuellen Gerät über die Kommandozeile gestartet werden.

Beim erstmaligen Ausführen müssen folgende Befehle verwendet werden:

- Kommandozeile 1:
```
npm install
npx react-native start
```

- Kommandozeile 2:
```
npx react-native run-android
```
Bis jetzt wurde die App lediglich auf Android-Geräten getestet.

Zu Beginn ist die dynamische Selektion der Karteikartensets leer. Um dies zu ändern, muss zunächst der Button `Karteikarten` gewählt werden. Anschließend muss die App auf dem Smartphone neugestartet werden. Erst dann können die Karteikarten korrekt gewählt und an das Spiel übergeben werden.

## Quellen

Die App bedient sich hauptsächlich an zwei Open Source Projekten, die jeweils wie folgt erweitert und/oder angepasst wurden:
- [Flappy Bird](https://github.com/lepunk/react-native-videos/tree/master/FlappyBird) zur Orientierung für Jump 'n' Run, eigenhändisch erweitert/verändert durch:
	- Grafiken erstellt und eingefügt
	- Eichhörnchen läuft am Boden
	- Herzen eingefügt
	- Rohre von Flappy Bird durch Baumstämme am Boden ersetzt
	- Karteikarten mit Nüssen als Belohnung eingebunden 
- [Karteikarten](https://github.com/jkmagnussen/mobile-flashcards), eigenhändisch erweitert/verändert durch:
	- einzelne Karteikarte löschen
	- Schwierigkeitsgrad zu Karteikarten hinzugefügt
	- anzeigen aller Karteikarten eines Sets
	- Style-Veränderungen
	- User-spezifische Wahl von Karteikarten zur Übergabe an Game.js zum Spielen
	- Navigation verschoben auf App.js


Weitere Quellen:
- [React Native Dokumentation](https://reactnative.dev/docs/getting-started)
- [React Native Game Engine](https://www.npmjs.com/package/react-native-game-engine)
- [Flappy Bird OS Post 1](https://medium.com/better-programming/flappy-bird-with-react-native-game-engine-and-matter-js-d5673f50eb9)
- [Flappy Bird OS Post 2](https://medium.com/better-programming/making-a-production-ready-flappy-bird-in-react-native-751713661a60)
- [Matter.js Dokumentation](https://brm.io/matter-js/docs/)
- [Getting started with Matter.js](https://code.tutsplus.com/tutorials/getting-started-with-matterjs-body-module--cms-28835)
- [Dynamisches Füllen des Pickers](https://stackoverflow.com/questions/47658765/objects-are-not-valid-as-a-react-child-found-object-promise/47659112) in `Home.js`
- [Länge eines Objekts anhand seiner Keys](https://stackoverflow.com/questions/5223/length-of-a-javascript-object) in `/src/cards/utils/api.js`
- [n zufällige Elemente einer Liste](https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array/38571132#38571132) in `/src/cards/utils/api.js`

Alle Bilder des Spiels wurden eigenständig erstellt.

## Versionen
Zur Entwicklung wurden jeweils folgende Versionen verwendet:
- JDK 11.0.1 oder 15.0.1
- Node 12.14.1 oder 14.15.1
- Gradle 6.3
-  Android Studio 4.1.1
- Android 10 (Q)
- Android SDK Platform 29
- Intel x86 Atom_64 System Image oder Google APIs Intel x86 Atom System Image
- Android SDK Build-Tools 29.0.2


## Dependencies
Siehe `package.json`.