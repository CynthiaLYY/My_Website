var mongoose=require('mongoose');
var SongSchema=require('../schemas/song');
var Song=mongoose.model('Song',SongSchema);
module.exports=Song;