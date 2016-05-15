"use strict";
var util = require('util');

function NaiveBayesClf() {
  if (!this){
    return new NaiveBayesClf();
  }

  this.data = { features: [], labels: [] };
  this.samplesTrained = 0;
  this.priors = [];
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

  let numFeatures = features_train[0].length;

  //initialize priors (can be overwritten in predict by passing in priors array)
  for (let i = 0; i < self.unique_labels.size; i++){
    self.priors.push(1 / self.unique_labels.size);
  }

  //initialize dataStore
  initializeDataStore(numFeatures, self.data, self.unique_labels);

  /*
    for each training example (ie ['email body text', 'email subject text'])
      for each feature group in the training example, split into words
        for each word in the feature group
          if not already in the dataStore, add it
          increment the label ct for that word
          increment the total label count
  */
  features_train.forEach( (example, exampleIdx) => {
    example.forEach( (feature, i) => {
      let featureElements = wordsFromString(feature);

      featureElements.forEach((word) => {
        if (!self.data.features[i][word]){
          addWordToDataStore(self.data.features[i], word, self.unique_labels);
        }

        self.data.features[i][word][labels_train[exampleIdx]] += 1;
        self.data.labels[i][labels_train[exampleIdx]] += 1;
      });
    });
  });


  console.log("dataStore after elements for each", util.inspect(self.data, false, null));
  self.samplesTrained += features_train.length;

  console.log("number of samples trained", self.samplesTrained);
}


NaiveBayesClf.prototype.predict = function (features_test, priorsLabel) {
  const self = this;

  let tests,
      featureGroup,
      labelGroup,
      labelScores = [];

  let numFeatures = features_test[0].length;

  //assumes each label is equally likely if priors not passed in
  priorsLabel = priorsLabel || self.priors;


  features_test.forEach( (example, exampleIdx) => {
    labelScores[exampleIdx] = [];

    example.forEach( (feature, featureIdx) => {
      let testFeatureElements = wordsFromString(feature);

      labelScores[exampleIdx][featureIdx] = [];

      featureGroup = self.data.features[featureIdx];
      labelGroup = self.data.labels[featureIdx];

      Array.from(self.unique_labels).forEach( (label, i, arr) => {
        labelScores[exampleIdx][featureIdx][label] = pOfLabel(label, priorsLabel[i], testFeatureElements, self.unique_labels, featureGroup, labelGroup);
      });
    });
  });


  let normalized,
      combined = [];

  features_test.forEach((test, i) => {
    //set up the structure for combined probs
    combined.push({});

    test.forEach( (group, j) => {
      self.unique_labels.forEach( (label) => {
        //set each label to 1 if undefined and multiply by each P
        if (!combined[i][label]){
          combined[i][label] = 1;
        }
        combined[i][label] *= labelScores[i][j][label];
      });
    })
  });

  normalized = normalizeP(combined);

  return normalized;
}


let wordsFromString = (str) => {
  str = str.replace(/[,'.?"\-;()<>\[\]_]/g, "");
  str = str.trim();
  return str.split(/\s+/);
} 


let normalizeP = (probList) => {
  //normalize probabilites so they sum to 1
  probList.forEach( (group) => {
    let sum = 0;
    for (var key in group){
      sum += group[key];
    }

    for (var key in group) {
      group[key] /= sum;
    }
  });

  return probList;
}


let initializeDataStore = (numFeatures, dataStore, unique_labels) => {
  for(let i = 0; i < numFeatures; i++){
    dataStore.features[i] = {};
    dataStore.labels[i] = {};

    unique_labels.forEach( (label) => {dataStore.labels[i][label] = 0;});
  }
}


let addWordToDataStore = (featureData, word, unique_labels) => {
  featureData[word] = {};
  unique_labels.forEach( (label) => { featureData[word][label] = 0 });
}


let pOfLabel = (label, pLabel, test, unique_labels, featureData, featureLabelData) => {
  //NEED TO ADD LAPLACE SMOOTHING


  //probabilites for a label
  let probabilities = [];

  test.forEach( (word) => {
    //first get P(word|label)
    let pWordLabel = pOfWordGivenLabel(word, label, featureData, featureLabelData);
    // console.log(`probability of "${word}" given "${label}"`, pWordLabel);

    //now calculate P(word) which is P(word|label1) * P(label1) + ... P(word|labelN) * P(labelN)
    let pWord = 0
    unique_labels.forEach( (label) => {
      // console.log("pword", pWord);
      pWord += pOfWordGivenLabel(word, label, featureData, featureLabelData) * pLabel;
    })
    // console.log(`probability of "${word}" is`, pWord);
    // console.log("");

    probabilities.push( pWord > 0 ? (pWordLabel * pLabel) / pWord  : 0 );
  });

  /* combine all of the Psub(i)'s for the labels into the final prob for each label
  will compute in log space -> https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering#Other_expression_of_the_formula_for_combining_individual_probabilities
  */
  let probsLn = probabilities.map( (p) => p == 0 ? 5 : (p == 1 ? -5 : (Math.log(1 - p) - Math.log(p))));


  let eta = probsLn.reduce( (prev, curr) => prev + curr);

  return 1 / ( 1 + Math.pow(Math.E, eta));
}


let pOfWordGivenLabel = (word, label, featureData, featureLabelData) => {
  /* P(word|label) is num of times that word appears for a given label divided by the total count of all words for that label
  */
  let ct = 0,
      totalLabelCt = 0;
    // console.log(`searching for "${word}"`, util.inspect(dataItem.words[word], false, null));
    if (featureData[word] !== undefined){
      //sum the number of times the word appeared for the given label
      ct += featureData[word][label];
    }

    //total number of words for the given label
    totalLabelCt = featureLabelData[label];

  return ct / totalLabelCt;
}
 
module.exports = NaiveBayesClf;