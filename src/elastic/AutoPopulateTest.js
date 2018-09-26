let autopopulate = require('mongoose-autopopulate');
let mongoose = require('mongoose');
let mongoosastic = require('mongoosastic');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const CONFIG = {
    "DB_URL" : "mongodb://localhost/test1",
    "DB_CONNECT_OPTION" : {"useMongoClient" : true},
    "PERSON_SCHEMA" : "PERSON",
    "AREA_SCHEMA" : "AREA",
    "BAND_SCHEMA" : "BAND",

    "ES_HOST" : "localhost",
    "ES_PORT" : 9200,
    "ES_CONF" : {"host" : "localhost", "port" : 9200}
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
            let areaSchema = new Schema({
                "code": String,
                "name": String
            });
            mongoose.model(CONFIG.AREA_SCHEMA, areaSchema, CONFIG.AREA_SCHEMA);

            let personSchema = new Schema({
                "name": {type:String, es_indexed:true},
                "nickName": String,
                "areaId": {"type":ObjectId, "ref":CONFIG.AREA_SCHEMA, "autopopulate":true }
            });
            personSchema.plugin(autopopulate);
            personSchema.plugin(mongoosastic, CONFIG.ES_CONF);
            let PersonModel = mongoose.model(CONFIG.PERSON_SCHEMA, personSchema, CONFIG.PERSON_SCHEMA);
            // PersonModel.createMapping((err, mapping)=> console.log(err, mapping) );
            

            let bandSchema = new Schema({
                "name": {type:String, es_indexed:true},
                "personId": {"type":ObjectId, "ref":CONFIG.PERSON_SCHEMA, "autopopulate":{"select" : "name"} },
                "areaId": {"type":ObjectId, "ref":CONFIG.AREA_SCHEMA, "autopopulate":true }
            });
            bandSchema.plugin(autopopulate);
            bandSchema.plugin(mongoosastic, CONFIG.ES_CONF);
            let BandModel = mongoose.model(CONFIG.BAND_SCHEMA, bandSchema, CONFIG.BAND_SCHEMA);
            // BandModel.createMapping((err, mapping)=> console.log(err, mapping) );
        }catch(err){
            throw err;
        }
    }

    static async saveRecords(){
        try {
            let People = mongoose.model(CONFIG.PERSON_SCHEMA);
            let Area = mongoose.model(CONFIG.AREA_SCHEMA);
            let Band = mongoose.model(CONFIG.BAND_SCHEMA);

            let taskList = [];
            let peopleRefId = mongoose.Types.ObjectId();
            let areaRefId = mongoose.Types.ObjectId();

            let personJson = {"_id": peopleRefId, "name": "Narendra Modi", "nickName":"Modi", "areaId": areaRefId};
            let personPojo = new People(personJson);
            taskList.push(personPojo.save());

            let areaJson = {"_id" : areaRefId, "code" : "IND", "name" : "INDIA"};
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

    static async fetchFromElastic(){
        try{
            let Band = mongoose.model(CONFIG.BAND_SCHEMA);

            Band.search(
                {
                    'query_string': {query: 'Politics'},
                },
                {
                    hydrate: true,
                    hydrateOptions: {lean: true}
                },
                (err, results)=>{
                    console.log(err);
                    console.log(results.hits.hits[0]);
                }
            );

            return "output";
        }catch(err){
            return Promise.reject(err);
        }
    } 

    static async main(){
        try{
            AutoPopulateTest.init();

            await AutoPopulateTest.saveRecords();

            let queryOutput = await AutoPopulateTest.fetchRecord();
            console.log(queryOutput);

            let eoutput = await AutoPopulateTest.fetchFromElastic();
            console.log(eoutput);
        }catch(err){
            console.log(err);
        }
    }
}

AutoPopulateTest.main();

