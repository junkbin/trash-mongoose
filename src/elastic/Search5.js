let mongoose     = require('mongoose')
  , mongoosastic = require('mongoosastic')
  , Schema       = mongoose.Schema
  elasticsearch = require('elasticsearch');
var Promise = require('bluebird');

mongoose.connect("mongodb://localhost/test1");


var UserSchema = new Schema({
    name: {type:String, es_indexed:true}
  , email: String
  , city: String
});
UserSchema.plugin(mongoosastic);
const UserModel = mongoose.model("USER", UserSchema, "USER");
UserModel.search = Promise.promisify(UserModel.search, {context: UserModel});


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