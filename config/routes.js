var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Song = require('../app/controllers/song');

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
	app.get('/admin/song/new', Song.new);

	//update a song
	app.get('/admin/song/update/:id', Song.update);

	//save a song
	app.post('/admin/song', Song.save);

	//songs list
	app.get('/admin/song/list', Song.list);

	//delete a song
	app.delete('/admin/song/list', Song.del);
	/**************************************************************!
	 *
	 **************************************************************/
};