var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var SongSchema=new Schema({
	singer: String,
	title: String,
	language: String,
	album: String,
	year: Number,
	genre: String,
	poster: String,
	url: String,
	codecs: String,
	category: {
		type: ObjectId,
		ref: 'Category'
	},
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