let mongoose     = require('mongoose')
  , mongoosastic = require('mongoosastic')
  , Schema       = mongoose.Schema
var Promise = require('bluebird');

mongoose.connect("mongodb://localhost/test1");


var EmployeeSchema = new Schema({
    name: {type:String, es_indexed:true},
    dept: {type:String},

    email: {type:String},
    mobile: {type:String},
    city: {type:String},
});
EmployeeSchema.plugin(mongoosastic);
const EmployeeModel = mongoose.model("Employee", EmployeeSchema, "employee");
EmployeeModel.search = Promise.promisify(EmployeeModel.search, {context: EmployeeModel});


function indexExistingCollection() {
    try{
        const EmployeeModel = mongoose.model("Employee");
        
        let count = 0;
        let stream =  EmployeeModel.synchronize();

        stream.on('data', function(err, doc){
            count++;
        });
        stream.on('close', function(){
            console.log('indexed ' + count + ' documents!');
        });
        stream.on('error', function(err){
            console.log(err);
        });

        return "DONE";
    }catch(err){
        throw err;
    }
}

function  main(){
    try{
        indexExistingCollection();
    }catch(err){
        console.log(err);
    }
}

main();