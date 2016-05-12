"use strict";

describe('Naive Bayes Classifier helper functions', function() {

  describe('wordsFromString', function() {
    it('should break a string into words', function() {
      expect(wordsFromString('this is a test string')).toEqual(['this', 'is', 'a', 'test', 'string']);
      expect(wordsFromString(' this is another  test string with extra spaces  ')).toEqual(['this', 'is', 'another', 'test', 'string', 'with', 'extra', 'spaces']);
    });

  });

});