
/*
 * GET home page.
 */

/**exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};**/

var crypto = require('crypto'),
	fs = require('fs'),
    User = require('../models/user.js'),
	Post = require('../models/post.js');
module.exports = function(app){

	app.get('/',function(req,res){
		Post.get(null,function(err,posts){
			if(err){
				console.log("is err ="+err);
				posts = [];
			}
			res.render('index',{
				title:'主页',
				user:req.session.user,
				posts:posts,
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			});
		})

	});

	//reg
	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg',{
			title:'注册',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		console.log('*****************开始注册*******************')
		var name = req.body.name;
		var password = req.body.password;
		var password_re = req.body['password-repeat'];
		if(password != password_re){
			req.flash('error','The two entered password do not match');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5');
		password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name:req.body.name,
			password : password,
			email : req.body.email
		})
		User.get(newUser.name,function(err,user){
			if(user){
				req.flash('error','the user already exist');
				return res.redirect('/reg');
			}
			newUser.save(function(err,user){
				console.log("***********save begin**********");
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = user;
				console.log("********** register user is success"+user);
				req.flash('success','successfully registered user');
				console.log("insert user  completed");
				res.redirect('/');
			});
		})

	});


	//login
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',
			{
				title:'登陆',
				user : req.session.user,
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			});
	});

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		console.log("*******************begin login*****************");
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(req.body.password,function(err,user){
			if(!user){
				req.flash("err","User not exists");
				return res.redirect('/login');
			}
			if(password != user.password){
				req.flash('err','password is error');
				return res.redirect('/login');
			}

			req.session.user = user;
			req.flash('success','login successfully');
			res.redirect('/');
		});
	});

	//
	app.get('/post',checkLogin);
	app.get('/post',function(req,res){
		res.render('post',
			{
				title:'发表',
				user:req.session.user,
				success:req.flash('success'),
				error:req.flash('error')
			});
	});

	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
		var title = req.body.title,
			content = req.body.content,
			currentUser = req.session.user;
			post = new Post(currentUser.name,title,content);
		post.save(function(err){
			if(err){
				req.flash('err',err);
				res.redirect('/post');
			}
			req.flash('success','The article was published successfully');
			res.redirect('/');
		});

	});

	app.get('/logout',checkLogin);
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','logout success');
		res.redirect('/');
	});

	app.get('/upload',checkLogin);
	app.get('/upload',function(req,res){
		res.render('upload',{
			title:'upload',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		})
	});

	app.post('/upload',checkLogin);
	app.post('/upload',function(req,res){
		console.log('begin to upload...');
		req.flash('success','upload file success');
	});



}

function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error','You not login');
		res.redirect('/login');
	}
	next();
}

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','You already login');
		res.redirect('back');
	}
	next();
}