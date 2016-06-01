var Song = require('../models/song');
var Category = require('../models/category');

//负责与首页进行交互

exports.index = function(req, res){
	//index page
	Category
		.find({})
		.populate({path: 'songs', options: {limit: 5}})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}

			res.render('index', {
				title: 'imusic 首页',
				categories: categories
			});
		});
};


