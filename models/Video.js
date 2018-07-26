const mongoose = require('mongoose');
const VideoSchema = new mongoose.Schema({
    etag: String,
    id: String,
    published: Date,
    channel: String,
    title: String,
    description: String,
    thumbSmall: String,
    thumbMedium: String,
    thumbLarge: String,
    channelTitle: String
});
module.exports = mongoose.model('Video', VideoSchema);