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

            let departmentJson = {"_id": departmentRefId, "name": "Admin", "description": "Admin Department"};
            let departmentPojo = new Department(departmentJson);
            taskList.push(departmentPojo.save());

            let employeeJson = {
                "_id": employeeRefId,
                "name": "Ashish Sarode",
                "age": "31",
                "phone": "8585201258",
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

    static async fetchRecordByAsync() {
        try {
            let Employee = mongoose.model(CONFIG.EMPLOYEE_SCHEMA);

            let output = await Employee.findOne().sort({"_id": -1}).exec();
            return output.toObject();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static async mainByAsync() {

        try {
            AutoPopulateTest.init();

            await AutoPopulateTest.saveRecords();
            let queryOutputByAsync = await AutoPopulateTest.fetchRecordByAsync();
            console.log("async promise \n", queryOutputByAsync);
        } catch (err) {
            console.log(err);
        }
    }

}

AutoPopulateTest.mainByAsync();

