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
    let ref1 = new UserModel({'name':'AFFIXUS Systems Pvt ltd.'});
    return await ref1.save();
}

async function  fetchData(){
    let UserModel = mongoose.model("USER");

    let results = await UserModel.search({
                'query_string': {query: 'affixus'},
            },{
                hydrate: true,
                hydrateOptions: {lean: true}
            });
    console.log(results);
}


async function  fetchData1(){
    let UserModel = mongoose.model("USER");

    let results = await UserModel.search({
                'query_string': {query: 'affixus'},
            });
    console.log(results);
}


async function unindex() {
    let UserModel = mongoose.model("USER");
    let id = "5bb75d03b0262560354c9232";

    let doc = await UserModel.findById(id).exec();
    doc.unIndex((err)=>console.log("Removed from index.", err));
}



function  main(){
    console.log("Hello");

    // fetchData();
    unindex();
}

main();