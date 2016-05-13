#Implementation of Naive Bayes Classifier geared towards text based applications

How to use it

```javascript
"use strict";

let NaiveBayesClassifier = require('./nb.js');

features_train = [['attention money please give me'],['attention your service money requested'],['hey dad how are you please'], ['buy our pills today'], ['hey do you want to meet me at the bar']];

labels_train = ['spam','spam','not spam', 'spam', 'not spam'];

nbc.train(features_train, labels_train);
let prediction = nbc.predict([['please give me money today']]);

console.log(prediction); //[ 'spam': 0.56637, 'not spam': 0.43363 ]
```