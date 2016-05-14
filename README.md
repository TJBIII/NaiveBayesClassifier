# JS Naive Bayes Classifier 
This is mainly geared towards text based applications (i.e. classifying emails as spam or not spam, classifying song lyrics to a specific artist, etc). This was not made to be a robust NB classifier to handle all possible feature structures/types. It was made to get more familiar with NB classifiers and for general Javascript practice.

### Punch list for future
- [ ] Laplace correction
- [X] Calculate probabilites in log space to prevent floating point underflow
- [ ] Support for reading in file as training data (in progress)
- [ ] Pass in prior probabilities for each label (currently priors are all equal)


### How to use it:
```javascript
"use strict";

let NaiveBayesClf = require('./nb.js');

let nbc = new NaiveBayesClf();

features_train = [['attention money please give me'],['attention your service money requested'],['hey dad how are you please'], ['buy our pills today'], ['hey do you want to meet me at the bar']];

labels_train = ['spam','spam','not spam', 'spam', 'not spam'];

nbc.train(features_train, labels_train);
let prediction = nbc.predict([['please give me money today']]);

console.log(prediction); //[ 'spam': 0.56637, 'not spam': 0.43363 ]
```