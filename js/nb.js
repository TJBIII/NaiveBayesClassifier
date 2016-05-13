"use strict";
var util = require('util');

function NaiveBayesClf() {
  if (!this){
    return new NaiveBayesClf();
  }

  this.data = [];
  this.samplesTrained = 0;
}



NaiveBayesClf.prototype.train = function () {

  const self = this;

  if (arguments.length !== 2){
    throw new Error("only accepts training features vector and training target values as arguments")
  }

  let features_train = arguments[0];
  let labels_train = arguments[1];

  if (features_train.length !== labels_train.length){
    throw new Error("length of your training vectors and target values do not match")
  }

  self.unique_labels = new Set(labels_train);
  console.log("unique_labels", Array.from(self.unique_labels));

  let dataLength = features_train.length;
  initializeDataStore(dataLength, self.data, self.unique_labels);
  // console.log("this.data", this.data);

  features_train.forEach( (element, i) => {
    let elements = wordsFromString(element[0]);

    elements.forEach((word) => {
      if (!self.data[i].words[word]){
        addWordToDataStore(self.data[i], word, self.unique_labels);
      }
      self.data[i].words[word][labels_train[i]] += 1;
      self.data[i].labels[labels_train[i]] += 1;
    })

  });

  console.log("self.data[i]", self.data);
  self.samplesTrained += dataLength;
}



NaiveBayesClf.prototype.predict = function (features_test) {
  let tests,
    labelScores = [],
    self = this;

  //split each test string into an array of words
  tests = processDataItems(features_test);
  // console.log("tests", tests);

  //assumes each label is equally likely
  let pLabel = 1 / self.unique_labels.size;

  tests.forEach( (test) => {
    self.unique_labels.forEach( (label, i) => {
      labelScores[i] = pOfLabel(label, pLabel, self.data, test, self.unique_labels)
    });
  });

  console.log("labelScores", labelScores);

  // return self.unique_labels[argMax(labelScores)];
}


let wordsFromString = (str) => {
  str = str.trim();
  return str.split(/\s+/);
} 

let initializeDataStore = (l, dataStore, unique_labels) => {
  for(let i = 0; i < l; i++){
    dataStore[i] = {
      words: {},
      labels: {}
    };

    unique_labels.forEach( (label) => {dataStore[i].labels[label] = 0;});
  }
}

let addWordToDataStore = (dataStore, word, unique_labels) => {
  dataStore.words[word] = {};
  unique_labels.forEach( (label) => { dataStore.words[word][label] = 0 });
}

let processDataItems = (items) => {
  let processed = [];

  items.forEach( (item, i) => {
    processed[i] = wordsFromString(item[0]);
  })

  return processed;
}

let pOfLabel = (label, pLabel, dataStore, test, unique_labels) => {
  //NEED TO ADD LAPLACE SMOOTHING

  //probabilites for a label
  let probabilities = [];
  console.log("");
  console.log("test", test);

  test.forEach( (word) => {

    //first get P(word|label)
    let pWordLabel = pOfWordGivenLabel(word, label, dataStore);
    console.log(`probability of "${word}" given "${label}"`, pWordLabel);

    //now calculate P(word) which is P(word|label1) * P(label1) + ... P(word|labelN) * P(labelN)
    let pWord = 0
    unique_labels.forEach( (label) => {
      pWord += pOfWordGivenLabel(word, label, dataStore);
    })
    console.log(`probability of "${word}"" is`, pWord);

    console.log("");
    probabilities.push( pWord > 0 ? (pWordLabel * pLabel) / pWord  : 0 );
  })

  console.log("probs", probabilities );

  return probabilities;
}

let pOfWordGivenLabel = (word, label, dataStore) => {
  // P(word|label) is num of times that word appears for a given label divided by the total count of all words for that label
  let ct = 0,
      totalWordsForLabel = 0;

  dataStore.forEach( (dataItem) => {
    // console.log(`searching for "${word}"`, util.inspect(dataItem.words[word], false, null));
    if (dataItem.words[word] !== undefined){
      //sum the number of times the word appeared for the given label
      ct += dataItem.words[word][label];
    }

    //sum the total number of words for the given label
    for (let word in dataItem.words) {
      totalWordsForLabel += dataItem.words[word][label];
    }
  });

  // console.log("ct", ct);
  // console.log("totalWordsForLabel", totalWordsForLabel);

  return ct / totalWordsForLabel;
}


let argMax = (arr) => {
  let maxIdx = 0,
      i;

  for (i = 0; i < arr.length; i++){
    if (arr[i] > arr[maxIdx]){
      maxIdx = i;
    }
  }
  return i;
}
 

let nbc = NaiveBayesClf();
nbc.train([['attention money please give me money'],['attention your service requested'],['hey dad how are you'], ['buy viagra are today']], ['spam','spam','not spam', 'spam']);
nbc.predict([['money to buy it today are']]);