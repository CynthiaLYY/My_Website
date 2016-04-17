var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Song = require('./models/song');
var User = require('./models/user');
var _ = require('underscore');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var port = process.env.PORT||3000;

var app = express();

mongoose.connect('mongodb://localhost/imusic');

app.set('views','./views/pages');
app.set('view engine','jade');

app.use(require('body-parser').urlencoded({extended: true})); //把 post 和 get 请求传至后台，转化成一个对象
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
	secret: 'imusic'
}));

app.locals.moment = require('moment');
app.listen(port);
console.log('my website started on port'+port);

//res -> responds ; req -> requests

//index page
app.get('/',function(req,res){
	console.log(req.session.user);
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

//signup
app.post('/user/signup',function(req,res){
	var _user=req.body.user;
	// '/user/signup' -> req.param('user') 通用：优先级 路由地址 -> body -> ？后（即query）
	// '/user/signup/:userid' -> req.params.userid
	// '/user/signup/111?userid=222' -> req.query.userid
	User.findOne({name:_user.name},function(err, user){
        if(err){
            console.log(err);
        }
        //console.log(user); //如果数据库为空时第一次注册返回回来的user为[]空数组，这里有问题
        if(user){
            return res.redirect('/');
        }else{
            user=new User(_user);
            user.save(function(err, user){
                if(err){
                    console.log(err);
                }
                res.redirect('/admin/userlist');
            });            
        }
    });
});

//signin
app.post('/user/signin',function(req,res){
	var _user=req.body.user;
	var name=_user.name;
	var password=_user.password;

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/');
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				req.session.user=user;
				return res.redirect('/');
			}else{
				console.log('Password is not matched');
			}
		});
	});
});

//userlist page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'用户列表',
			users:users
		});
	});	
});

//songlist page
app.get('/admin/list',function(req,res){
	Song.fetch(function(err,songs){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title:'歌曲列表',
			songs:songs
		});
	});	
});

//lsit delete song
app.delete('/admin/list',function(req,res){
	var id=req.query.id;

	if(id){
		Song.remove({_id:id},function(err,song){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		});
	}
});

//admin input page
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
			poster:'',
			url:'',
			codecs:''
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
			poster:songObj.poster,
			url:songObj.url,
			codecs:songObj.codecs
		});
		_song.save(function(err,song){
				if(err){
					console.log(err);
				}

				res.redirect('/song/'+song._id);
			});
	}
});

//get a song with id
app.get('/song/:id',function(req,res){
	var id=req.params.id;

	Song.findById(id,function(err,song){
		res.render('detail',{
			title:'imusic',
			song:song
		});
	});
	
});