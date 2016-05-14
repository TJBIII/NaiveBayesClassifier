"use strict";
var util = require('util');

function NaiveBayesClf() {
  if (!this){
    return new NaiveBayesClf();
  }

  this.data = { features: [], labels: [] };
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

  let numFeatures = features_train[0].length;
  initializeDataStore(numFeatures, self.data, self.unique_labels);
  console.log("this.data", this.data);

  //for each training example (ie ['email body text', 'email subject text'])
    //for each feature group in the training example, split into words
      //for each word in the feature group
        //if not already in the dataStore, add it
        //increment the label ct for that word
        //increment the total label count
  features_train.forEach( (example, exampleIdx) => {
    // console.log("example", example);
    example.forEach( (feature, i) => {
      let featureElements = wordsFromString(feature);
      // console.log("featureElements", featureElements);
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


NaiveBayesClf.prototype.predict = function (features_test) {
  let tests,
    labelScores = [],
    self = this;

  //assumes each label is equally likely
  let pLabel = 1 / self.unique_labels.size;

  // features_test.forEach( (example, exampleIdx) => {
  //   console.log("testexample", example);
  //   example.forEach( (feature, i) => {
  //     let testFeatureElements = wordsFromString(feature);
  //     console.log("testfeatureElements", testFeatureElements);
  //     self.unique_labels.forEach( (label, i) => {
  //     labelScores[i] = pOfLabel(label, pLabel, self.data, testFeatureElements, self.unique_labels);
  //     });
  //   });
  // });

  features_test.forEach( (example, exampleIdx) => {
    console.log("testexample", example);
    example.forEach( (feature, featureIdx) => {
      console.log("feature", feature);
      let testFeatureElements = wordsFromString(feature);
      console.log("testfeatureElements", testFeatureElements);

      self.unique_labels.forEach( (label, i) => {
      labelScores[i] = pOfLabel(label, pLabel, self.data, testFeatureElements, self.unique_labels, self.data.features[featureIdx], self.data.labels[featureIdx]);
      });
    });
  });




  //split each test string into an array of words
  // tests = processTests(features_test);


  // tests.forEach( (test) => {
  //   console.log("test", test);
  //   self.unique_labels.forEach( (label, i) => {
  //     labelScores[i] = pOfLabel(label, pLabel, self.data, test, self.unique_labels)
  //   });
  // });

  return labelScores;
}


let wordsFromString = (str) => {
  str = str.trim();
  return str.split(/\s+/);
} 

let initializeDataStore = (numFeatures, dataStore, unique_labels) => {

  for(let i = 0; i < numFeatures; i++){
    dataStore.features[i] = {};
    dataStore.labels[i] = {};

    unique_labels.forEach( (label) => {dataStore.labels[i][label] = 0;});
  }

  // console.log('initializeDataStore', dataStore);
}

let addWordToDataStore = (dataStore, word, unique_labels) => {
  dataStore[word] = {};
  unique_labels.forEach( (label) => { dataStore[word][label] = 0 });
}



// let processTests = (items) => {
//   let processed = [];
//   items.forEach( (item, i) => {
//     processed[i] = wordsFromString(item[0]);
//   })
//   return processed;
// }



let pOfLabel = (label, pLabel, dataStore, test, unique_labels, featureData, labelData) => {
  //NEED TO ADD LAPLACE SMOOTHING

  //probabilites for a label
  let probabilities = [];
  console.log("");
  console.log("test", test);
  console.log("featureData", featureData);


  test.forEach( (word) => {

    //first get P(word|label)
    let pWordLabel = pOfWordGivenLabel(word, label, featureData, labelData);
    console.log(`probability of "${word}" given "${label}"`, pWordLabel);

    //now calculate P(word) which is P(word|label1) * P(label1) + ... P(word|labelN) * P(labelN)
    let pWord = 0
    unique_labels.forEach( (label) => {
      // console.log("pword", pWord);
      pWord += pOfWordGivenLabel(word, label, dataStore) * pLabel;
    })
    console.log(`probability of "${word}" is`, pWord);

    console.log("");
    probabilities.push( pWord > 0 ? (pWordLabel * pLabel) / pWord  : 0 );
  });

  console.log("probs", probabilities );

  //combine all of the Psub(i)'s for the labels into the final prob for each label
  //will compute in log space -> https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering#Other_expression_of_the_formula_for_combining_individual_probabilities
  let probsLn = probabilities.map( (p) => p != 0 ? (p < 1 ? (Math.log(1- p) - Math.log(p)) : 0) : p);

  console.log("probs ln", probsLn);

  let eta = probsLn.reduce( (prev, curr) => prev + curr);

  return 1 / ( 1 + Math.pow(Math.E, eta));
}

let pOfWordGivenLabel = (word, label, featureData, labelData) => {
  // P(word|label) is num of times that word appears for a given label divided by the total count of all words for that label
  let ct = 0,
      totalLabelCt = 0;
    // console.log(`searching for "${word}"`, util.inspect(dataItem.words[word], false, null));
    if (featureData[word] !== undefined){
      //sum the number of times the word appeared for the given label
      ct += featureData[word][label];
    }

    //total number of words for the given label
    console.log("labelData", labelData);
    totalLabelCt = labelData[label];

  return ct / totalLabelCt;
}
 
module.exports = NaiveBayesClf;