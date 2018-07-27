'use strict';
const { google } = require('googleapis');
require('dotenv').config({ path: './variables.env' });

//database connection and mongoose model
const connectToDatabase = require('./db');
const Video = require('./models/Video');

//authentication
const youtube = google.youtube({ version: 'v3', auth: process.env.APIKEY });


//lambda function
module.exports.getVideos = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const chosenDate = new Date('2018-07-20T00:00:00Z'); //this needs to be calculated / automated
  const queryString = ['vuejs | reactjs | Angularjs'];
  const searchParameters = {
    //also check out order https://developers.google.com/youtube/v3/docs/search/list
    part: 'snippet',
    q: queryString,
    maxResults: 10,
    publishedAfter: chosenDate,
    // type: 'video,channel,playlist',
    type: 'video', //only retreive videos
  };
  
  //call the youtube API
  youtube.search.list(searchParameters, (err, data) => {
    if (err) {
      console.error('Error: ' + err);
    }
    if (data) {
      let results = `date: ${chosenDate} queryString: ${queryString} total results: ${data.data.pageInfo.totalResults} number per page: ${data.data.pageInfo.resultsPerPage}`;
      let videos = [];//empty array to hold video information
      data.data.items.forEach( (ele) => {
        videos.push({
          etag: ele.etag,
          id: ele.id.videoId,
          published: ele.snippet.publishedAt,
          channel: ele.snippet.channelId,
          title: ele.snippet.title,
          description: ele.snippet.description,
          thumbSmall: ele.snippet.thumbnails.default.url,
          thumbMedium: ele.snippet.thumbnails.medium.url,
          thumbLarge: ele.snippet.thumbnails.high.url,
          channelTitle: ele.snippet.channelTitle
        });
      });
      //save the videos array to the database
      connectToDatabase()
        .then( () => {
          Video.create(videos)
            .then( (thevids) => {
              const response = {
                statusCode: 200,
                body: JSON.stringify({
                  message: 'The results of the youtube search API have been written to the database',
                  summary: results,
                  videos: thevids
                }),
              };
              callback(null, response);
            })
            .catch( (err) => {
              callback(null, { 
                statusCode: err.statusCode || 500, 
                headers: { 'Content-Type': 'text/plain' }, 
                body: 'Could not create (insert to DB) the videos' 
              });
            });
        })
        .catch( (err)=>{
          console.error(err);
        });
    };
  });
};
    