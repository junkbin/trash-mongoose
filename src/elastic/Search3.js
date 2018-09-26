let mongoose     = require('mongoose')
  , mongoosastic = require('mongoosastic')
  , Schema       = mongoose.Schema

var User = new Schema({
    name: {type:String, es_indexed:true}
  , email: String
  , city: String
});
User.plugin(mongoosastic)
mongoose.model("USER", User, "USER");


mongoose.connect("mongodb://localhost/test1");

async function appSave(){
    let UserModel = mongoose.model("USER");
    let ref1 = new UserModel({'name':'AFFIXUS'});
    return await ref1.save();
}

function fetchData(){
    let UserModel = mongoose.model("USER");

    UserModel.search(
            {
                'query_string': {query: 'affixus'},
            },
            {
                hydrate: true,
                hydrateOptions: {lean: true}
            },
            (err, results) => {
                console.log(err);
                if(results){
                    console.log(JSON.stringify(results));
                }
            }
        );
}


function  main(){
    console.log("Hello");

    fetchData();
}

main();