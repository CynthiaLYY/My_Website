var _ = require('underscore');
var Category = require('../models/category');
var Song = require('../models/song');
var Comment = require('../models/comment');
//负责与歌曲页面交互

//songs list
exports.list = function(req, res){
	Song.fetch(function(err, songs){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: '歌曲列表',
			songs: songs
		});
	});	
};

//delete a song
exports.del = function(req, res){
	var id=req.query.id;

	if(id){
		Song.remove({_id:id}, function(err, song){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1});
			}
		});
	}
};

//new a song
exports.new = function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin', {
			title:'imusic 后台',
			categories: categories,
			song:{
				/*title: '',
				singer: '',
				language: '',
				album: '',
				year: '',
				genre: '',
				poster: '',
				url: '',
				codecs: '',
				category:''*/
			}
		});
	});
};

//update a song
exports.update = function(req, res){
	var id = req.params.id;

	if(id){
		Song.findById(id, function(err, song){
			res.render('admin', {
				title: 'imusic 后台更新',
				song: song
			});
		});
	}
};

//save a song
exports.save = function(req, res){
	var id = req.body.song._id;
	var songObj = req.body.song;
	if(id){
		Song.findById(id, function(err, song){
			if(err){
				console.log(err);
			}
			_song = _.extend(song,songObj);
			_song.save(function(err, song){
				if(err){
					console.log(err);
				}

				res.redirect('/song/' + song._id);
			});
		});
	}else{
		_song = new Song(songObj);
		_song.save(function(err, song){
				if(err){
					console.log(err);
				}

				res.redirect('/song/'+song._id);
			});
	}
};

//song detail
exports.detail = function(req, res){
	var id = req.params.id;

	Song.findById(id, function(err, song){
		Comment
			.find({song: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments){
				res.render('detail', {
				title: 'imusic',
				song: song,
				comments: comments
			});
		});
	});
};