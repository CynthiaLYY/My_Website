var express=require('express');
var port=process.env.PORT||3000;
var app=express();
app.set('views','./views');
app.set('view engine','jade');
app.listen(port);
console.log('my website started on port'+port);

app.get('/',function(req,res){
	res.render('index',{
		title:'首页'
	});
});
app.get('/item/list',function(req,res){
	res.render('list',{
		title:'列表'
	});
});
app.get('/admin/item',function(req,res){
	res.render('admin',{
		title:'后台'
	});
});
app.get('/item/:id',function(req,res){
	res.render('detail',{
		title:'详情'
	});
});