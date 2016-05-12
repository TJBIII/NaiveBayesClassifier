"use strict";

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
  console.log("samples trained", self.samplesTrained);
}



NaiveBayesClf.prototype.predict = function (features_test) {
  let processedDataItems,
    labelScores = [],
    self = this;

  processedDataItems = processDataItems(features_test);
  console.log("proccessedDataItems", processedDataItems);

  self.unique_labels.forEach( (label, i) => {
    // labelScores[i] = pForLabel(label, self.data, processedDataItems);
  });

  return self.unique_labels[argMax(labelScores)];
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

let pForLabel = (label, dataStore, processed) => {
  //probabilites for a label
  let probabilities = [];
  console.log("");
  console.log("processed", processed);
  dataStore.forEach( (dataItem, i) => {
    console.log("processed[i]", processed[i]);
    processed[i].forEach( (word, j) => {
      probabilities.push(pOfWordGivenLabel(word, label, dataItem))
    });
  });

  return combineProbs(probabilities);
}

let pOfWordGivenLabel = (word, label, dataItem) => {
  // P(word|label) is num of times that word appears for a given label divided by the total count of all words for that label
  let givenClassTotal = dataItem.labels[label];
  let ct;

  //most basic laplace correction
  if (dataItem.words[word] === undefined){
    ct = 1;
  } else {
    ct = dataItem.words[word][label];
  }

  if (ct === 0) {
    //set the ct to 1 and increase all other label cts
    ct = 1;

    for (let incLabel in dataItem.words[words]){
      console.log("incLabel", incLabel);
      if (dataItem.words[word].hasOwnProperty(incLabel)){
        dataItem.words[word][incLabel] += 1;
      }
    }
  }

  return ct / givenClassTotal;
}


let argMax = (arr) => {
  let maxIdx = 0;

  for (let i = 0; i < arr.length; i++){
    if (arr[i] > arr[maxIdx]){
      maxIdx = i;
    }
  }
  return i;
}
 

let nbc = NaiveBayesClf();
nbc.train([['attention please give me money'],['attention your service requested'],['hey dad how are you'], ['buy viagra today']], ['spam','spam','not spam', 'spam']);
nbc.predict([['money to buy it today']]);