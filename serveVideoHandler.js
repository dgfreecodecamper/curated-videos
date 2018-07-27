'use strict';
const connectToDatabase = require('./db');
const Video = require('./models/Video');
require('dotenv').config({ path: './variables.env' });

//pull the selected video information from mongodb
module.exports.pullVideos = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then( () => {
      Video.find()
        .then( (videos) => {
          const response = {
            statusCode: 200,
            body: JSON.stringify({ videos: videos })
          };
          callback(null, response)
        })
        .catch( (err) => { 
          callback(null, { 
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not retreive videos from the DB' 
          }) 
        });
    })
    .catch( (err) => {
      console.error(err);
    });

};
