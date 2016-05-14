"use strict";

let NaiveBayesClf = require('./nb.js');
let fs = require('fs');

let nbc = NaiveBayesClf();

/****** SPAM EMAIL EXAMPLE 1 ******/
// nbc.train([['send me money to nigeria'],['send money to us'],['dad did you send the money to me to go see the concert with mom on tuesday']], ['spam','unknown','not spam']);
// console.log('prediction', nbc.predict([['please give me money to buy viagra today as your service requested']]));

/****** SPAM EMAIL EXAMPLE 2 ******/
// nbc.train([['attention money please give me'],['attention your service money requested'],['hey dad how are you please'], ['buy our pills today'], ['hey do you want to meet me at the bar']], ['spam','spam','not spam', 'spam', 'not spam']);
// console.log('prediction', nbc.predict([['please give me money today']]));


nbc.train([['attention money please give me', 're: wtf'],['attention your service money requested', 're: yo'],['hey dad how are you please', 'update'], ['buy our pills today','act now!'], ['hey do you want to meet me at the bar', 'friday']], ['spam','spam','not spam', 'spam', 'not spam']);
console.log('prediction', nbc.predict([['please give me money today', 're: friday']]));

// /****** Lyrics Example 1 ******/
// let features_train_doom = fs.readFileSync('doomLyrics.txt').toString().split('\n');
// let labels_train = [];
// features_train_doom = features_train_doom.map( (e) => {
//   //add the label
//   labels_train.push('doom');
//   //return the line as an array
//   e = e.toLowerCase();
//   return new Array(e);
// });

// let features_train_not_doom = fs.readFileSync('notDoomLyrics.txt').toString().split('\n');

// features_train_not_doom = features_train_not_doom.map( (e) => {
//   labels_train.push('not doom');
//   e = e.toLowerCase();
//   return new Array(e);
// });

// let features_train = features_train_doom.concat(features_train_not_doom);

// nbc.train(features_train, labels_train);

// console.log("predict: 'i love you':", nbc.predict([['i\'ll love you']]));
// console.log("predict: 'metal face villain':", nbc.predict([['known amongst face figaro gin tang nimble fang']]));
// console.log("predict: 'psycho tails tied science fiction drop':", nbc.predict([['psycho tails tied science fiction drop']]));
