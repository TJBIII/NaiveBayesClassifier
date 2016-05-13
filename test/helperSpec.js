"use strict";

let dataStore = [ { words: 
     { attention: { spam: 1, 'not spam': 0 },
       money: { spam: 1, 'not spam': 0 },
       please: { spam: 1, 'not spam': 0 },
       give: { spam: 1, 'not spam': 0 },
       me: { spam: 1, 'not spam': 0 } },
    labels: { spam: 5, 'not spam': 0 } },
  { words: 
     { attention: { spam: 1, 'not spam': 0 },
       your: { spam: 1, 'not spam': 0 },
       service: { spam: 1, 'not spam': 0 },
       money: { spam: 1, 'not spam': 0 },
       requested: { spam: 1, 'not spam': 0 } },
    labels: { spam: 5, 'not spam': 0 } },
  { words: 
     { hey: { spam: 0, 'not spam': 1 },
       dad: { spam: 0, 'not spam': 1 },
       how: { spam: 0, 'not spam': 1 },
       are: { spam: 0, 'not spam': 1 },
       you: { spam: 0, 'not spam': 1 },
       please: { spam: 0, 'not spam': 1 } },
    labels: { spam: 0, 'not spam': 6 } },
  { words: 
     { buy: { spam: 1, 'not spam': 0 },
       pills: { spam: 1, 'not spam': 0 },
       are: { spam: 1, 'not spam': 0 },
       today: { spam: 1, 'not spam': 0 } },
    labels: { spam: 4, 'not spam': 0 } } ];



describe('Naive Bayes Classifier helper functions', function() {

  describe('wordsFromString', function() {
    it('should break a string into words', function() {
      expect(wordsFromString('this is a test string')).toEqual(['this', 'is', 'a', 'test', 'string']);
      expect(wordsFromString(' this is another  test string with extra spaces  ')).toEqual(['this', 'is', 'another', 'test', 'string', 'with', 'extra', 'spaces']);
    });
  });

  describe('processTests', function() {
    it('should split each test string into an array of words', function() {
      expect(processTests([['this is a string'], ['here is another']])).toEqual([['this', 'is', 'a', 'string'], ['here', 'is', 'another']]);
    });
  });

  describe('pOfWordGivenLabel', function() {
    it('should return the correct probability P(word|label)', function() {
      expect(pOfWordGivenLabel('are', 'spam', dataStore)).toEqual(1/14);
      expect(pOfWordGivenLabel('are', 'not spam', dataStore)).toEqual(1/6);
      expect(pOfWordGivenLabel('money', 'spam', dataStore)).toEqual(2/14);
      expect(pOfWordGivenLabel('money', 'not spam', dataStore)).toEqual(0);
    });
  
    it('should return 0 for a word not in the dataStore', function() {
      expect(pOfWordGivenLabel('villian', 'spam', dataStore)).toEqual(0);
      expect(pOfWordGivenLabel('supercalifragilisticexpialidocious', 'not spam', dataStore)).toEqual(0);    
    });
  });


  describe('initializeDataStore', function() {
    it('should set up the data store', function() {
      let dataStore = [];
      initializeDataStore(3, dataStore, new Set(['spam', 'not spam']));

      expect(dataStore).toEqual(
        [
          { words: {  }, labels: { spam: 0, 'not spam': 0 } }, 
          { words: {  }, labels: { spam: 0, 'not spam': 0 } },
          { words: {  }, labels: { spam: 0, 'not spam': 0 } }
        ]
      )
    });
  });

  

});