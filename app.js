var express = require('express'),
    app=express(),
    bodyParser = require('body-parser'),
    methodOverride= require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require('mongoose');

    //mongoose.connect('mongodb://localhost/blog_app');
    mongoose.connect('mongodb://ayush:ayush1112@ds125273.mlab.com:25273/blogapp');
    
    app.set('view engine','ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(expressSanitizer());
    app.use(methodOverride('_method'));
//database schema
	var blogSchema = new mongoose.Schema({
		title:String,
		image:String,//{type:String,default:"image.jpg"}
		body:String,
		created:{type:Date, default:Date.now}
	});

	var Blog = mongoose.model('Blog',blogSchema);

	// Blog.create({
	// 	title:'Test Blog',
	// 	image:'https://images.unsplash.com/photo-1538409218084-925d3d5662cc?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=51daf011b320daa022a45a1dde4df113&auto=format&fit=crop&w=750&q=80',
	// 	body:'hello this IS TEST BLOG post!!'
	// });

	//RESTFUL ROUTES
	//INDEX ROUTE 
	app.get('/',function(req,res){
		res.redirect('/blogs');
	});
	app.get('/blogs',function(req,res){
		Blog.find({},function(err,blogs){ //sending blog to ejs
			if(err){
				console.log('ERROR!!');
			}else{ 
					res.render('index',{blogs:blogs});
			     }
		});
		
	});

	//NEW ROUTE
	app.get('/blogs/new',function(req,res){
		res.render('new');
	});

	//CREATE ROUTE
	app.post('/blogs',function(req,res){
		req.body.blog.body=req.sanitize(req.body.blog.body)
		Blog.create(req.body.blog,function(err,newBlog){
			if(err){
				res.render('new');
			}else{
				res.redirect('/blogs');
			}
		});
	});

	//SHOW ROUTE
	app.get('/blogs/:id',function(req,res){
		Blog.findById(req.params.id,function(err,foundBlog){
			if(err){
				res.redirect('/blogs');
			}else{
				res.render('show',{blog:foundBlog});
			}
		})
	})

	//EDIT ROUTE
	app.get('/blogs/:id/edit',function(req,res){
		Blog.findById(req.params.id,function(err,foundBlog){
			if(err){
				res.redirect('/blogs');
			}else{
				res.render('edit',{blog:foundBlog});
			}
		})
	});

	//UPDATE ROUTE
	app.put('/blogs/:id',function(req,res){
				req.body.blog.body=req.sanitize(req.body.blog.body)
		Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
			if(err){
				res.redirect('/blogs');
			}else{
				res.redirect('/blogs/'+req.params.id);
			}
		});
	});


	//Delete
	app.delete('/blogs/:id',function(req,res){
		Blog.findByIdAndRemove(req.params.id,function(err){
			if(err){
				res.redirect('/blogs');
			}else{
				res.redirect('/blogs');
			}
		})
	});


    app.listen(3000||(process.env.PORT,process.env.IP),function(){

    	console.log('SERVER IS RUNNING');
    });