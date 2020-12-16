import { Dimensions } from 'react-native';

export default Constants = {
    MAX_WIDTH: Dimensions.get('screen').width,
    MAX_HEIGHT: Dimensions.get('screen').height,
    GAP_SIZE: 200,
    SQUIRREL_WIDTH: 54,
    SQUIRREL_HEIGHT: 37, 

    DECKS: [
        {"632mgp7hm68vzvg2amz1hq": {
        id: "632mgp7hm68vzvg2amz1hq",
        title: "React",
        questions: [
          {
            question: "What is ReactJS?",
            answer:
              "ReactJS is an open-source frontend JavaScript library which is used for building user interfaces, specifically for single page applications."
          },
          {
            question: "What is JSX?",
            answer:
              "JSX is a syntax notation for JavaScript XML(XML-like syntax extension to ECMAScript). It stands for JavaScript XML."
          },
          {
            question: "What is virtual DOM?",
            answer:
              "The virtual DOM (VDOM) is an in-memory representation of Real DOM."
          },
          {
            question: "What is Babel?",
            answer: "Babel is a JavaScript compiler"
          }
        ]
      }},
      {"724mgp7hm68vzvg2amz1hq": {
        id: "724mgp7hm68vzvg2amz1hq",
        title: "HTML",
        questions: [
          {
            question: "What does HTML stand for?",
            answer: "Hyper Text Markup Language"
          },
          {
            question: "What should values always be enclosed in?",
            answer: "Quotation marks"
          },
          {
            question:
              "Where do all items for the same web site need to be saved?",
            answer: "In the same folder"
          },
          {
            question:
              "What is always a welcome page, and explains the purpose or topic of the site?",
            answer: "Home Page"
          }
        ]
      }}]
}
