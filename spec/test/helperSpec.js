"use strict";

let helper = require('../../js/helper.js');

let dataStore = { 
    features: [ 
      { 
        attention: { spam: 2, 'not spam': 0 },
        money: { spam: 2, 'not spam': 1 },
        please: { spam: 1, 'not spam': 1 },
        give: { spam: 1, 'not spam': 0 },
        me: { spam: 1, 'not spam': 1 },
        your: { spam: 1, 'not spam': 0 },
        service: { spam: 1, 'not spam': 0 },
        requested: { spam: 1, 'not spam': 0 },
        hey: { spam: 0, 'not spam': 2 },
        dad: { spam: 0, 'not spam': 1 },
        how: { spam: 0, 'not spam': 1 },
        are: { spam: 0, 'not spam': 1 },
        you: { spam: 0, 'not spam': 2 },
        buy: { spam: 1, 'not spam': 0 },
        our: { spam: 1, 'not spam': 0 },
        pills: { spam: 1, 'not spam': 0 },
        today: { spam: 1, 'not spam': 0 },
        do: { spam: 0, 'not spam': 1 },
        want: { spam: 0, 'not spam': 1 },
        to: { spam: 0, 'not spam': 1 },
        meet: { spam: 0, 'not spam': 1 },
        at: { spam: 0, 'not spam': 1 },
        the: { spam: 0, 'not spam': 1 },
        bar: { spam: 0, 'not spam': 1 } 
      },
      { 
        're:': { spam: 2, 'not spam': 0 },
        must: { spam: 1, 'not spam': 0 },
        read: { spam: 1, 'not spam': 0 },
        attention: { spam: 1, 'not spam': 0 },
        update: { spam: 0, 'not spam': 1 },
        act: { spam: 1, 'not spam': 0 },
        'now!': { spam: 1, 'not spam': 0 },
        friday: { spam: 0, 'not spam': 1 } 
      } 
    ],
    labels: [ 
      { spam: 14, 'not spam': 17 }, 
      { spam: 7, 'not spam': 2 } 
    ] 
  };

describe('Naive Bayes Classifier helper functions', function() {

  describe('wordsFromString', function() {
    it('should break a string into words', function() {
      expect(helper.wordsFromString('this is a test string')).toEqual(['this', 'is', 'a', 'test', 'string']);
      expect(helper.wordsFromString(' this is another  test string with extra spaces  ')).toEqual(['this', 'is', 'another', 'test', 'string', 'with', 'extra', 'spaces']);
    });

    it('should remove unwanted punctuation', function() {
      expect(helper.wordsFromString('t<h>"is i;s a -test wi(t)h? p\'unc_,')).toEqual(['this', 'is', 'a', 'test', 'with', 'punc'])
    
    });
  });

  
  describe('pOfWordGivenLabel', function() {
    let words = dataStore.features[0];
    let labels = dataStore.labels[0];

    it('should return the correct probability P(word|label)', function() {
      expect(helper.pOfWordGivenLabel('me', 'spam', words, labels)).toEqual(1/14);
      expect(helper.pOfWordGivenLabel('me', 'not spam', words, labels)).toEqual(1/17);
      expect(helper.pOfWordGivenLabel('money', 'spam', words, labels)).toEqual(2/14);
      expect(helper.pOfWordGivenLabel('money', 'not spam', words, labels)).toEqual(1/17);
    });
  
    it('should return 0 for a word not in the dataStore', function() {
      expect(helper.pOfWordGivenLabel('villian', 'spam', words, labels)).toEqual(0);
      expect(helper.pOfWordGivenLabel('supercalifragilisticexpialidocious', 'not spam', words, labels)).toEqual(0);    
    });
  });


  describe('initializeDataStore', function() {
    it('should set up the data store', function() {
      let dataStore = { features: [], labels: [] };
      helper.initializeDataStore(2, dataStore, new Set(['spam', 'not spam']));

      expect(dataStore).toEqual(
        { features: [{},{}],
          labels: [{spam: 0, 'not spam': 0 }, {spam: 0, 'not spam': 0 }] 
        }
      );
    });
  });


  describe('addWordToDataStore ', function() {
    it('should add the word with the labels', function() {
      let features = {},
          unique_labels = new Set(['spam', 'not spam']);
      helper.addWordToDataStore(features, "word1", unique_labels)
      expect(features).toEqual({'word1': {spam: 0, 'not spam': 0 } })
    });
  });


  describe('normalizeP', function() {
    it('should normalize the probabilites so they add up to one', function() {
      let probs = [ { spam: 0.28318584070796454, 'not spam': 0.21681415929203543 },
                  { spam: 0.26666666666666666, 'not spam': 0.23333333333333334 } ];
      expect(helper.normalizeP(probs)).toEqual([ { spam: 0.5663716814159291, 'not spam': 0.43362831858407086 },
          { spam: 0.5333333333333333, 'not spam': 0.4666666666666667 } ]);
    });

    it('should return the same probs if already normalized', function () {
      let probs = [ {spam: 0.6, 'not spam': 0.4}];
      expect(helper.normalizeP(probs)).toEqual(probs)

    })
  });
});