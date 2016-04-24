var Song = require('../models/song');
//负责与首页进行交互

exports.index = function(req, res){
	//index page
	console.log(req.session.user); //可以获取session中的登录状态
	
	Song.fetch(function(err, songs){
		if(err){
			console.log(err);
		}
		
		res.render('index', {
			title: 'imusic 首页',
			songs: songs
		});
	});
};


