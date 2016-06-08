"use strict";
let util = require('util');
let helper = require('./helper.js');
let wordsFromString = helper.wordsFromString;


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
    throw new Error("only accepts training features vector and training target values as arguments");
  }

  let features_train = arguments[0];
  let labels_train = arguments[1];

  if (features_train.length !== labels_train.length){
    throw new Error("length of your training vectors and target values do not match");
  }

  self.unique_labels = new Set(labels_train);

  let numFeatures = features_train[0].length;

  //initialize priors (can be overwritten in predict by passing in priors array)
  for (let i = 0; i < self.unique_labels.size; i++){
    self.priors.push(1 / self.unique_labels.size);
  }

  //initialize dataStore
  helper.initializeDataStore(numFeatures, self.data, self.unique_labels);

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
          helper.addWordToDataStore(self.data.features[i], word, self.unique_labels);
        }

        self.data.features[i][word][labels_train[exampleIdx]] += 1;
        self.data.labels[i][labels_train[exampleIdx]] += 1;
      });
    });
  });


  // console.log("dataStore after elements for each", util.inspect(self.data, false, null));
  self.samplesTrained += features_train.length;
  console.log("number of samples trained", self.samplesTrained);
};



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
        labelScores[exampleIdx][featureIdx][label] = helper.pOfLabel(label, priorsLabel[i], testFeatureElements, self.unique_labels, featureGroup, labelGroup);
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
    });
  });

  normalized = helper.normalizeP(combined);

  return normalized;
};
 
module.exports = NaiveBayesClf;