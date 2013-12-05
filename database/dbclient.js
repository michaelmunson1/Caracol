//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = caracolPG.knex; // require('./dbsetup.js').knex;
var tables = require('./dbschemas.js');
var algorithm = require('../controllers/algorithm.js');
var _ = require('underscore');

// convert a datetime in ISO format generated by Javascript's Date object into Postgres format
var dateTransform = function(ISOdatetime) {
  ISOdatetime = ISOdatetime.replace('T',' ');
  ISOdatetime = ISOdatetime.slice(0,19);
  ISOdatetime = ISOdatetime + '+00';
  return ISOdatetime;
};

exports.createUser = createUser = function(json, callback){
  new tables.User({username: json.username})
  .save()
  .then(function(model){
    console.log('whoa we saved a user', model.attributes);
    callback(null, model.attributes);
  }, function(){
    console.log('not so fast little man');
    callback(error);
  });
};

exports.findUser = findUser = function(json, callback){
  new tables.Users({username: json.username})
  .query()
  .where({username: json.username})
  .then(function(model){
    console.log('we found you!', model[0]);
    callback(null, model[0]);
  }, function(results){
    console.log('please signup!');
    callback(error);
  });
};


exports.dbInsert = dbInsert = function(json, user_id, callback){
  //TODO prevent duplicate clippings by
  //periodically scanning for duplictes in database

  //check: clipping already exists?

  //if so, capture that clipping id
  //if not, return the new clipping id

  new tables.Clipping({
    title: json.title,
    content: json.content,
    uri: json.url,
    word_count: json.word_count,
    first_insert: dateTransform(new Date().toISOString()),
    total_pages: json.total_pages,
    date_published: json.date_published,
    dek: json.dek,
    lead_image_url: json.lead_image_url,
    next_page_id: json.next_page_id,
    rendered_pages: json.rendered_pages
  })
  .save()
  .then(function(model) {
    console.log('finished saving the clipping');
    insertUserClipping(user_id, model.id, callback);
    algorithm.removeHTMLAndTokenize(model.id);
  }, function(){
    console.log('Error saving the clipping');
    callback(error);
  });


  'id',  'user_id', 'clipping_id',    //'created_at',
  'vote', 'bookmarkStatus', 'lastBookmarkTime',
  'lastVoteTime' 

  //check: user_clipping already exists?
  new tables.User_Clipping({
    title: json.title,
    content: json.content,
    uri: json.url,
    word_count: json.word_count,
    first_insert: dateTransform(new Date().toISOString()),
    total_pages: json.total_pages,
    date_published: json.date_published,
    dek: json.dek,
    lead_image_url: json.lead_image_url,
    next_page_id: json.next_page_id,
    rendered_pages: json.rendered_pages
  })
  .save()
  .then(function(model) {
    console.log('finished saving the clipping');
    callback(null, model.id);
    algorithm.removeHTMLAndTokenize(model.id);
  }, function(){
    console.log('Error saving the clipping');
    callback(error);
  });
};

var insertUserClipping = function(user_id, clipping_id, callback){
  new tables.User_Clipping({
    user_id: user_id,
    clipping_id: clipping_id
  })
  .save()
  .then(function(model){
    console.log('success to the user clipping table', model.attributes);
    callback(null, model.attributes.clipping_id);
  }, function(){
    console.log('error adding to user_clippings');
  });
};

exports.fetchClippings = fetchClippings = function(fetchClippingsOlderThanThisClippingId, callback) {
  // not actually making use of fetchClippingsOlderThanThisClippingId yet
  new tables.Clippings({id: fetchClippingsOlderThanThisClippingId})
  // below is for local storage solution
  // .query()
  // .where({id: fetchClippingsOlderThanThisClippingId})
  .fetch()
  .then(function(results) {
    console.log('successfully grabbed clippings from the db:', results);
    callback(null, results);
  }, function(error) {
    console.log('there was an error fetching clippings from the db:', error);
    callback(error);
  });
};

exports.dbVote = dbVote = function(json){
  //update query update user clippings set vote where user clipping ==
  console.log('called', json);
  new tables.User_Clipping()
  .query()
  .where({user_id: json.user_id, clipping_id: json.clipping_id})
  .then(function(model){
    console.log(model[0].id);
    new tables.User_Clipping({id: model[0].id})
    .save({vote: json.vote}).then(function(model){
      console.log('look what i did ma', model);
    }, function(){
      console.log('error saving to userclipping id');
    });
  }, function(){
    console.log('welcome ot the danger zone');
  });
};

exports.fetchRecommendations = fetchRecommendations = function(callback) {
  new tables.Recommendations()
  .fetch({ withRelated: ['clipping'] })
  .then(function(results) {
    console.log('results of db query look like:',results);
    callback(null, results);
  }, function(error) {
    console.log('error fetching recs from the db:', error);
    callback(error);
  });
};
