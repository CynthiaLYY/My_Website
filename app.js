var express=require('express');
var path=require('path');
var mongoose=require('mongoose');
var Song=require('./models/song');
var _=require('underscore');
var port=process.env.PORT||3000;
var app=express();

mongoose.connect('mongodb://localhost/imusic');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.locals.moment = require('moment');
app.listen(port);
console.log('my website started on port'+port);

app.get('/',function(req,res){
	Song.fetch(function(err,songs){
		if(err){
			console.log(err);
		}
		res.render('index',{
			title:'imusic 首页',
			songs:songs
		});
	});
});

app.get('/admin/list',function(req,res){
	Song.fetch(function(err,songs){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title:'imusic 列表',
			songs:songs
		});
	});	
});
app.get('/admin/song',function(req,res){
	res.render('admin',{
		title:'imusic 后台',
		song:{
			title:'',
			singer:'',
			language:'',
			album:'',
			year:'',
			genre:'',
			poster:''
		}
	});
});

//admin update song
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id;

	if(id){
		Song.findById(id,function(err,song){
			res.render('admin',{
				title:'imusic 后台更新',
				song:song
			});
		});
	}
});


//admin post song
app.post('/admin/song/new',function(req,res){
	var id=req.body.song._id;
	var songObj=req.body.song;
	if(id!=='undefined'){
		Song.findById(id,function(err,song){
			if(err){
				console.log(err);
			}
			_song=_.extend(song,songObj);
			_song.save(function(err,song){
				if(err){
					console.log(err);
				}

				res.redirect('/song/'+song._id);
			});
		});
	}else{
		_song=new Song({
			title:songObj.title,
			singer:songObj.singer,
			language:songObj.language,
			album:songObj.album,
			year:songObj.year,
			genre:songObj.genre,
			poster:songObj.poster
		});
		_song.save(function(err,song){
				if(err){
					console.log(err);
				}

				res.redirect('/song/'+song._id);
			});
	}
});

app.get('/song/:id',function(req,res){
	var id=req.params.id;

	Song.findById(id,function(err,song){
		res.render('detail',{
			title:'imusic',
			song:song
		});
	});
	
});