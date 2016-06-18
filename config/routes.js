var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Song = require('../app/controllers/song');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function(app){
	//res -> responds ; req -> requests
	
	//pre handle user
	app.use(function(req, res, next){
		var _user = req.session.user;

		app.locals.user = _user;

		return next();
	});

	/**************************************************************!
	 * Index
	 **************************************************************/
	//index
	app.get('/', Index.index);
	/**************************************************************!
	 *
	 **************************************************************/
	
	/**************************************************************!
	 * User
	 **************************************************************/
	//signup
	app.post('/user/signup', User.signup);

	//signin
	app.post('/user/signin', User.signin);

	//logout
	app.get('/logout', User.logout);

	//users list
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

	//signup to
	app.get('/signup', User.showSignup);

	//signin to
	app.get('/signin', User.showSignin);
	/**************************************************************!
	 *
	 **************************************************************/

	/**************************************************************!
	 * Song
	 **************************************************************/
	//song detail
	app.get('/song/:id', Song.detail);

	//new a song
	app.get('/admin/song/new', User.signinRequired, Song.new);

	//update a song
	app.get('/admin/song/update/:id', User.signinRequired, Song.update);

	//save a song
	app.post('/admin/song', User.signinRequired, Song.save);

	//songs list
	app.get('/admin/song/list', Song.list);

	//delete a song
	app.delete('/admin/song/list', User.signinRequired, User.adminRequired, Song.del);
	/**************************************************************!
	 *
	 **************************************************************/

	 /**************************************************************!
	 * Comment
	 **************************************************************/
	//save a comment
	app.post('/user/comment', User.signinRequired, Comment.save);
	/**************************************************************!
	 *
	 **************************************************************/

	 /**************************************************************!
	 * Category
	 **************************************************************/
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
  	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
  	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
	/**************************************************************!
	 *
	 **************************************************************/
};