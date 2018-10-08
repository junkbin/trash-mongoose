let mongoose     = require('mongoose')
  , Schema       = mongoose.Schema

mongoose.connect("mongodb://localhost/test1");


var EmployeeSchema = new Schema({
    name: {type:String},
    dept: {type:String},

    email: {type:String},
    mobile: {type:String},
    city: {type:String},
});
mongoose.model("Employee", EmployeeSchema, "employee");


async function appSave(i){
    let EmployeeModel = mongoose.model("Employee");

    let pojo = {
        'name':'AFFIXUS Systems Pvt ltd.' + i,
        'dept' : 'CSE',
        'email' : 'abd@gmail.com',
        'mobile' : '1234567890',
        'city' : 'Belapur'
    }
    let ref1 = new EmployeeModel(pojo);
    return await ref1.save();
}


async function main(){
    try{
        let taskList = [];
        for(let i=0; i<10; i++){
            taskList.push(appSave(i));
        }

        let allDone = await Promise.all(taskList);
        console.log(allDone);
    }catch(err){
        console.log(err);
    }
}

main();