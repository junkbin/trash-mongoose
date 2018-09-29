let mongoose     = require('mongoose')
  , mongoosastic = require('mongoosastic')
  , Schema       = mongoose.Schema
  elasticsearch = require('elasticsearch');
var Bluebird = require('bluebird');

var esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    sniffOnStart: true,
    sniffInterval: 60000,
    defer: function () {
        return Bluebird.defer();
    }
});

var User = new Schema({
    name: {type:String, es_indexed:true}
  , email: String
  , city: String
});
User.plugin(mongoosastic,   {esClient: esClient});
mongoose.model("USER", User, "USER");


mongoose.connect("mongodb://localhost/test1");

async function appSave(){
    let UserModel = mongoose.model("USER");
    let ref1 = new UserModel({'name':'AFFIXUS'});
    return await ref1.save();
}

async function  fetchData(){
    let UserModel = mongoose.model("USER");

    let results = await UserModel.search({
                'query_string': {query: 'affi'},
            },{
                hydrate: true,
                hydrateOptions: {lean: true}
            });
    console.log(results);
    
}


function  main(){
    console.log("Hello");

    fetchData();
}

main();