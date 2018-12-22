let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const CONFIG = {
    "DB_URL": "mongodb://localhost/promisedb",
    "DB_CONNECT_OPTION": {"useMongoClient": true},
    "EMPLOYEE_SCHEMA": "EMPLOYEE",
    "DEPARTMENT_SCHEMA": "DEPARTMENT"
};

class AutoPopulateTest {
    static init() {
        try {
            mongoose.connect(CONFIG.DB_URL);

            AutoPopulateTest.dbSchemaInit();
        } catch (err) {
            throw err;
        }
    }

    static dbSchemaInit() {
        try {
            let departmentSchema = new Schema({
                "name": String,
                "description": String
            });
            mongoose.model(CONFIG.DEPARTMENT_SCHEMA, departmentSchema, CONFIG.DEPARTMENT_SCHEMA);

            let employeeSchema = new Schema({
                "name": String,
                "age": String,
                "phone": String,
                "departmentId": {"type": ObjectId, "ref": CONFIG.DEPARTMENT_SCHEMA}
            });
            mongoose.model(CONFIG.EMPLOYEE_SCHEMA, employeeSchema, CONFIG.EMPLOYEE_SCHEMA);

        } catch (err) {
            throw err;
        }
    }

    static async saveRecords() {
        try {
            let Department = mongoose.model(CONFIG.DEPARTMENT_SCHEMA);
            let Employee = mongoose.model(CONFIG.EMPLOYEE_SCHEMA);

            let taskList = [];
            let departmentRefId = mongoose.Types.ObjectId();
            let employeeRefId = mongoose.Types.ObjectId();

            let departmentJson = {"_id": departmentRefId, "name": "Technical", "description": "Technical Department"};
            let departmentPojo = new Department(departmentJson);
            taskList.push(departmentPojo.save());

            let employeeJson = {
                "_id": employeeRefId,
                "name": "Jayanti Kathale",
                "age": "29",
                "phone": "5285647895",
                "departmentId": departmentRefId
            };
            let employeePojo = new Employee(employeeJson);
            taskList.push(employeePojo.save());

            let output = await Promise.all(taskList);
            return output;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static fetchRecord() {
        return new Promise(function (resolve, reject) {

            let id = "5c1ce93e165eb7f82f0b6e7a";
            let Employee = mongoose.model(CONFIG.EMPLOYEE_SCHEMA);
            let mpromise = Employee.findById(id).exec();
            mpromise.then(function (employeeDoc) {

                if (employeeDoc) {
                    resolve(employeeDoc);
                } else {
                    console.log("Invalid Id");
                }
            }).catch(function (err) {
                console.log(err);
                reject(err);
            })
        });
    }

    static updateRecord() {
        return new Promise(function (resolve, reject) {

            let id = "5c1ce93e165eb7f82f0b6e76";        // wrong id :   5c1ce93e165eb7f82f0b6e7a
            let Employee = mongoose.model(CONFIG.EMPLOYEE_SCHEMA);
            let mpromise = Employee.findById(id).exec();
            mpromise.then(function (employeeDoc) {

                return Employee.update({"_id": employeeDoc.id}, {"name": "Kaushik Ahuja"});
            }).then(function (doc) {

                return Employee.findById(doc.id);
            }).then(function (record) {

                resolve(record);
            }).catch(function (err) {

                console.log(err);
                reject(err);
            })
        });
    }


    static main() {
        return new Promise(function (resolve, reject) {

            try {
                AutoPopulateTest.init();

                // await AutoPopulateTest.saveRecords();

                // let mpromise = AutoPopulateTest.updateRecord();

                let mpromise = AutoPopulateTest.fetchRecord();
                mpromise.then(function (record) {

                    console.log("simple promise \n", record);
                    resolve(record)
                }).catch(function (err) {

                    reject(err);
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
}

AutoPopulateTest.main();
