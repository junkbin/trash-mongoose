var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(8008, function () {
    console.log('server started');
});

app.get('/', function (req, res) {
    console.log(req.cookies);
    res.send('welcome')
});

app.post('/post', function (req, res) {
    let data = req.body.name + '\t' + req.body.age + '\t' + req.body.phone;
    console.log(data);
    res.send('Record saved successfully !');
});

app.put('/put', function (req, res) {
    let data = req.body.name + '\t' + req.body.age + '\t' + req.body.phone;
    console.log(data);
    res.send('updated\n' + data)
});

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const CONFIG = {
    "DB_URL": "mongodb://localhost/node",
    "DB_CONNECT_OPTION": {"useMongoClient": true},
    "PERSON_SCHEMA": "PERSON",
};


class Sample {

    static init() {
        try {
            mongoose.connect(CONFIG.DB_URL);
            Sample.dbInitialize();
        } catch (err) {
            console.log(err);
        }
    }

    static dbInitialize() {
        try {
            let personSchema = new Schema({
                "_id": ObjectId,
                "name": String,
                "age": Number,
                "phone": Number,
            });
            mongoose.model(CONFIG.PERSON_SCHEMA, personSchema, CONFIG.PERSON_SCHEMA);
        } catch (err) {
            throw err;
        }
    }

    static main(inputJson) {
        return new Promise(function (resolve, reject) {
            Sample.init();
            let mpromise = Sample.saveRecord(inputJson);
            mpromise.then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    static saveRecord(inputJson) {
        return new Promise(function (resolve, reject) {
            try {
                let People = mongoose.model(CONFIG.PERSON_SCHEMA);
                let peopleRefId = mongoose.Types.ObjectId();

                let personJson = {
                    "_id": peopleRefId,
                    "name": inputJson.name,
                    "age": inputJson.age,
                    "phone": inputJson.phone
                };
                
                let personPojo = new People(personJson);
                let mpromise = personPojo.save();
                mpromise.then(function (dbdoc) {
                    resolve(dbdoc)
                }).catch(function (err) {
                    reject(err)
                });

            } catch (err) {
                reject(err);
            }
        });
    }
}