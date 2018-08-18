let autopopulate = require('mongoose-autopopulate');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const CONFIG = {
    "DB_URL" : "mongodb://localhost/test1",
    "DB_CONNECT_OPTION" : {"useMongoClient" : true},
    "PERSON_SCHEMA" : "PERSON",
    "SUBAREA_SCHEMA" : "SUBAREA",
    "AREA_SCHEMA" : "AREA",
    "BAND_SCHEMA" : "BAND",
};

class AutoPopulateTest {
    static init(){
        try{
            mongoose.connect(CONFIG.DB_URL);

            AutoPopulateTest.dbSchemaInit();
        }catch(err){
            throw err;
        }
    }

    static dbSchemaInit(){
        try{
            let subAreaSchema = new Schema({
                "code": String,
                "name": String
            });
            subAreaSchema.plugin(autopopulate);
            mongoose.model(CONFIG.SUBAREA_SCHEMA, subAreaSchema, CONFIG.SUBAREA_SCHEMA);

            let areaSchema = new Schema({
                "code": String,
                "name": String,
                "subareaId" : {"type":ObjectId, "ref":CONFIG.SUBAREA_SCHEMA, "autopopulate":{"select":"name code", "maxDepth":1} },
            });
            areaSchema.plugin(autopopulate);
            mongoose.model(CONFIG.AREA_SCHEMA, areaSchema, CONFIG.AREA_SCHEMA);

            let personSchema = new Schema({
                "name": String,
                "nickName": String,
                "areaId": {"type":ObjectId, "ref":CONFIG.AREA_SCHEMA, "autopopulate":{"select":"code ", "maxDepth":2} },
                "areaId2": {"type":ObjectId, "ref":CONFIG.AREA_SCHEMA, "autopopulate":{"select":"name code", "maxDepth":2} },
                //"areaId3": {"type":ObjectId, "ref":CONFIG.AREA_SCHEMA },
            });
            personSchema.plugin(autopopulate);
            mongoose.model(CONFIG.PERSON_SCHEMA, personSchema, CONFIG.PERSON_SCHEMA);

            let bandSchema = new Schema({
                "name": String,
                "personId": {"type":ObjectId, "ref":CONFIG.PERSON_SCHEMA, "autopopulate":{"select" : "name", "maxDepth":2} },
                "areaId": {"type":ObjectId, "ref":CONFIG.AREA_SCHEMA, "autopopulate":{"select":"name", "maxDepth" : 2} }
            });
            bandSchema.plugin(autopopulate);
            mongoose.model(CONFIG.BAND_SCHEMA, bandSchema, CONFIG.BAND_SCHEMA);
        }catch(err){
            throw err;
        }
    }

    static async saveRecords(){
        try {
            let People = mongoose.model(CONFIG.PERSON_SCHEMA);
            let Area = mongoose.model(CONFIG.AREA_SCHEMA);
            let SubArea = mongoose.model(CONFIG.SUBAREA_SCHEMA);
            let Band = mongoose.model(CONFIG.BAND_SCHEMA);

            let taskList = [];
            let peopleRefId = mongoose.Types.ObjectId();
            let areaRefId = mongoose.Types.ObjectId();
            let subareaRefId = mongoose.Types.ObjectId();

            let personJson = {"_id": peopleRefId, "name": "Narendra Modi", "nickName":"Modi", "areaId": areaRefId, "areaId2": areaRefId,"areaId3": areaRefId};
            let personPojo = new People(personJson);
            taskList.push(personPojo.save());

            let subareaJson = {"_id" : subareaRefId, "code" : "SUB-IND", "name" : "SUB-INDIA"};
            let subareaPojo = new SubArea(subareaJson);
            taskList.push(subareaPojo.save());

            let areaJson = {"_id" : areaRefId, "code" : "IND", "name" : "INDIA", "subareaId":subareaRefId};
            let areaPojo = new Area(areaJson);
            taskList.push(areaPojo.save());

            let bandJson = {"name" : "Politics", "personId":peopleRefId, "areaId" : areaRefId};
            let bandPojo = new Band(bandJson);
            taskList.push(bandPojo.save());

            let output = await Promise.all(taskList);
            return output;
        }catch(err){
            return Promise.reject(err);
        }
    }

    static async fetchRecord(){
        try{
            let Band = mongoose.model(CONFIG.BAND_SCHEMA);

            let output = await Band.findOne().sort({"_id":-1}).exec();
            return output.toObject();
        }catch(err){
            return Promise.reject(err);
        }
    }

    static async main(){
        try{
            AutoPopulateTest.init();

            await AutoPopulateTest.saveRecords();

            let queryOutput = await AutoPopulateTest.fetchRecord();
            console.log(JSON.parse(JSON.stringify(queryOutput)));
        }catch(err){
            console.log(err);
        }
    }
}

AutoPopulateTest.main();

