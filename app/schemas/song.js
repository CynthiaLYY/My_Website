var mongoose=require('mongoose');
var SongSchema=new mongoose.Schema({
	singer: String,
	title: String,
	language: String,
	album: String,
	year: Number,
	genre: String,
	poster: String,
	url: String,
	codecs: String,
	meta: {
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});
SongSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	}
	next();
});
SongSchema.statics={
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb);
	}
};
module.exports=SongSchema;