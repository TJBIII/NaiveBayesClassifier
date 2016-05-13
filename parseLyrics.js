"use strict";

let fs = require('fs');

let NB = require('nb');


let features_train_doom = fs.readFileSync('doomLyrics.txt').toString().split('\n');
let labels_train = [];
features_train_doom.forEach( (e) => labels_train.push('doom'));

let features_train_not_doom = fs.readFileSync('notDoomLyrics.txt').toString().split('\n');

features_train_not_doom.forEach( (e) => labels_train.push('not doom'));

let features_train = features_train_doom + features_train_not_doom;

let nbc = new NaiveBayesClf();

