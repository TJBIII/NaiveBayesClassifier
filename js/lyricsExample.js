"use strict";

let NaiveBayesClf = require('./nb.js');
let fs = require('fs');

let nbc = new NaiveBayesClf();

/****** SPAM EMAIL EXAMPLE 1 ******/
// nbc.train([['send me money to nigeria'],['send money to us'],['dad did you send the money to me to go see the concert with mom on tuesday']], ['spam','unknown','not spam']);
// console.log('prediction', nbc.predict([['please give me money to buy viagra today as your service requested']]));

/****** SPAM EMAIL EXAMPLE 2 ******/
// nbc.train([['attention money please give me'],['attention your service money requested'],['hey dad how are you please'], ['buy our pills today'], ['hey do you want to meet me at the bar']], ['spam','spam','not spam', 'spam', 'not spam']);
// console.log('prediction', nbc.predict([['please me']]));


// nbc.train([['attention money please give me', 're: must read'],['attention your service money requested', 're: attention'],['hey dad how are you please', 'update'], ['buy our pills today','act now!'], ['hey do you want to meet me at the bar', 'friday']], ['spam','spam','not spam', 'spam', 'not spam']);
// console.log('prediction', nbc.predict([['please give me money today', 'friday'], ['dad meet at the bar please', 'friday']]));

// nbc.train([['attention money please give me', 're: must read', 'this is crazy'],['attention your service money requested', 're: attention', 'this is weird'],['hey dad how are you please', 'update', 'talk to you soon'], ['buy our pills today','act now!', 'this is amazing'], ['hey do you want to meet me at the bar', 'friday', 'this friday']], ['spam','spam','not spam', 'spam', 'not spam']);
// console.log('prediction', nbc.predict([['please give me money today attention', 're: friday', 'this now'], ['dad meet at the bar please', 'friday', ' talk to you soon'], ['wat money', 'test', 'test']]));

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

// console.log("predict: 'i'll love you metal face':", nbc.predict([['i\'ll love metal face']]));
// console.log("predict: 'metal face villain':", nbc.predict([['known amongst face figaro gin tang nimble fang']]));
// console.log("predict: 'psycho tails tied science fiction drop':", nbc.predict([['psycho tails tied science fiction drop']]));
