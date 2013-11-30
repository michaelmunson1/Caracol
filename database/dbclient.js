//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = caracolPG.knex; // require('./dbsetup.js').knex;
var tables = require('./dbschemas.js');



exports.dbInsert = dbInsert = function(json){
  console.log(json);
  new tables.Clipping({title: json.title, content: json.content, uri: json.url, word_count: json.word_count})
  .save()
  .then(function() {
    console.log('finished saving the clipping');
  }, function(){
    console.log('Error saving the clipping');
  });

};
