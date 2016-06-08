"use strict";


let pOfWordGivenLabel = (word, label, featureData, featureLabelData) => {
    /* P(word|label) is num of times that word appears for a given label divided by the total count of all words for that label
    */
    let ct = 0,
        totalLabelCt = 0;

      if (featureData[word] !== undefined){
        //sum the number of times the word appeared for the given label
        ct += featureData[word][label];
      }

      //total number of words for the given label
      totalLabelCt = featureLabelData[label];

    return ct / totalLabelCt;
  }

module.exports = {

  wordsFromString: (str) => {
    str = str.replace(/[,'.?"\-;()<>\[\]_]/g, "");
    str = str.trim();
    return str.split(/\s+/);
  },


  normalizeP: (probList) => {
    //normalize probabilites so they sum to 1
    probList.forEach( (group) => {
      let sum = 0;
      for (var key in group){
        sum += group[key];
      }

      for (key in group) {
        group[key] /= sum;
      }
    });

    return probList;
  },


  initializeDataStore: (numFeatures, dataStore, unique_labels) => {
    for(let i = 0; i < numFeatures; i++){
      dataStore.features[i] = {};
      dataStore.labels[i] = {};

      unique_labels.forEach( (label) => {dataStore.labels[i][label] = 0;});
    }
  },


  addWordToDataStore: (featureData, word, unique_labels) => {
    featureData[word] = {};
    unique_labels.forEach( (label) => { featureData[word][label] = 0; });
  },


  pOfLabel: (label, pLabel, test, unique_labels, featureData, featureLabelData) => {
    //NEED TO ADD LAPLACE SMOOTHING

    //probabilites for a label
    let probabilities = [];

    test.forEach( (word) => {
      //first get P(word|label)
      let pWordLabel = pOfWordGivenLabel(word, label, featureData, featureLabelData);
      // console.log(`probability of "${word}" given "${label}"`, pWordLabel);

      //now calculate P(word) which is P(word|label1) * P(label1) + ... P(word|labelN) * P(labelN)
      let pWord = 0;
      unique_labels.forEach( (label) => {
        // console.log("pword", pWord);
        pWord += pOfWordGivenLabel(word, label, featureData, featureLabelData) * pLabel;
      });
      // console.log(`probability of "${word}" is`, pWord);

      probabilities.push( pWord > 0 ? (pWordLabel * pLabel) / pWord  : 0 );
    });

    /* combine all of the Psub(i)'s for the labels into the final prob for each label
    will compute in log space -> https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering#Other_expression_of_the_formula_for_combining_individual_probabilities
    */
    let probsLn = probabilities.map( (p) => p === 0 ? 5 : (p === 1 ? -5 : (Math.log(1 - p) - Math.log(p))));


    let eta = probsLn.reduce( (prev, curr) => prev + curr);

    return 1 / ( 1 + Math.pow(Math.E, eta));
  },


  pOfWordGivenLabel: pOfWordGivenLabel

};