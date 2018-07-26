const { google } = require('googleapis');
require('dotenv').config({ path: './variables.env' });

//authentication
var youtube = google.youtube({ version: 'v3', auth: process.env.APIKEY });

const chosenDate = new Date('2018-07-24T00:00:00Z'); //this needs to be calculated
console.log(`The date selected for today is: ${chosenDate}`);

let keyWords = ['vuejs', 'reactjs', 'angularjs'];


//loop over the keyWord array and conduct the search for each keyWord
keyWords.forEach( (kw, index) => {
  
  const searchParameters = {
    //also check out order https://developers.google.com/youtube/v3/docs/search/list
    part: 'snippet',
    q: kw,
    maxResults: 4,
    publishedAfter: chosenDate,
    // type: 'video,channel,playlist',
    type: 'video', //only retreive videos
  };
  
  
  youtube.search.list(searchParameters, (err, data) => {
    if (err) {
      console.error('Error: ' + err);
    }
    if (data) {
      
      let searchInfo = {};
      //populate the searchInfo object
      searchInfo.num = index;
      searchInfo.kw = kw;
      searchInfo.totRes = data.data.pageInfo.totalResults;
      searchInfo.res = data.data.pageInfo.resultsPerPage;
      console.log(searchInfo);
      
      //populate the videoInfo object
      data.data.items.forEach( (ele) => {
        
        let videoInfo = {};
        videoInfo.etag = ele.etag;
        videoInfo.id = ele.id.videoId;
        videoInfo.published = ele.snippet.publishedAt;
        videoInfo.channel = ele.snippet.channelId;
        videoInfo.title = ele.snippet.title;
        videoInfo.description = ele.snippet.description;
        videoInfo.thumbSmall = ele.snippet.thumbnails.default.url;
        videoInfo.thumbMedium = ele.snippet.thumbnails.medium.url;
        videoInfo.thumbLarge = ele.snippet.thumbnails.high.url;
        videoInfo.channelTitle = ele.snippet.channelTitle;
        console.log(videoInfo);
      });
    }
  });
});