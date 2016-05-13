"use strict";

describe('Naive Bayes Classifier', function() {

  describe('Naive Bayes classifier exists', function() {
    it('should not throw an error when constructed', function() {
      let nbc = NaiveBayesClf();
    });

    it('should have a data store and samples trained properties', function() {
      let nbc = NaiveBayesClf();
      expect(nbc.data).toBeDefined();
      expect(nbc.samplesTrained).toEqual(0);
    });

    it('should have a trian method', function () {
      let nbc = NaiveBayesClf();
      expect(nbc.train).toBeDefined();
    })

    it('should have a predict method', function () {
      let nbc = NaiveBayesClf();
      expect(nbc.predict).toBeDefined();
    })
  });

  describe('nbc.train', function() {
    beforeEach(function() {
      let nbc = new NaiveBayesClf();
    });

    it('should accept 2 arguments', function() {
      expect( () => {nbc.train([1,1,1])}).toThrow(new Error("only accepts training features vector and training target values as arguments"));
    });

  });

});