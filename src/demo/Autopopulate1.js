let mongoose = require('mongoose');
let autopopulate = require('mongoose-autopopulate');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const CONFIG = {
    "DB_URL": "mongodb://localhost/promisedb",
    "DB_CONNECT_OPTION": {"useMongoClient": true},
    "AUTHOR_SCHEMA": "AUTHOR",
    "BOOK_SCHEMA": "BOOK"
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
            let authorSchema = new Schema({
                "firstName": String,
                "lastName": String,
                "country": String,
            });
            mongoose.model(CONFIG.AUTHOR_SCHEMA, authorSchema, CONFIG.AUTHOR_SCHEMA);

            let bookSchema = new Schema({
                "name": String,
                "price": Number,
                "edition": Number,
                "authorId": {"type": ObjectId, "ref": CONFIG.AUTHOR_SCHEMA, "autopopulate":  {select: "firstName country"}}
            });
            bookSchema.plugin(autopopulate);
            mongoose.model(CONFIG.BOOK_SCHEMA, bookSchema, CONFIG.BOOK_SCHEMA);

        } catch (err) {
            throw err;
        }
    }

    static async saveRecords() {
        try {
            let Book = mongoose.model(CONFIG.BOOK_SCHEMA);
            let Author = mongoose.model(CONFIG.AUTHOR_SCHEMA);

            let taskList = [];
            let bookRefId = mongoose.Types.ObjectId();
            let authorRefId = mongoose.Types.ObjectId();

            let authorJson = {"_id": authorRefId, "firstName": "Sharon", "lastName": "Lechter", "country": "United States"};

            let authorPojo = new Author(authorJson);
            taskList.push(authorPojo.save());

            let bookJson = {
                "_id": bookRefId,
                "name": "Rich Dad Poor Dad",
                "price": 378.15,
                "edition": 2.2,
                "authorId": authorRefId
            };
            let bookPojo = new Book(bookJson);
            taskList.push(bookPojo.save());

            let output = await Promise.all(taskList);
            return output;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static fetchRecord() {
        return new Promise(function (resolve, reject) {
            let Book = mongoose.model(CONFIG.BOOK_SCHEMA);
            let mpromise = Book.find().exec();
            mpromise.then(function (dbdocList) {
                if (dbdocList) {
                    resolve(dbdocList);
                } else {
                    console.log("Invalid Output");
                }
            }).catch(function (err) {
                console.log(err);
                reject(err);
            })
        });
    }


    static async main() {
        try {
            AutoPopulateTest.init();

            // await AutoPopulateTest.saveRecords();

            let record = await AutoPopulateTest.fetchRecord();
            console.log("\nsimple promise \n**************************\n\n", record);

        } catch (err) {
            console.log(err);
        }
    }
}

AutoPopulateTest.main();
