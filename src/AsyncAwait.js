/**
 * Async Await Demo : An alternate promise.
 */
class AsyncAwait {

    static async dbInit(){
        try{

            // return Date.now();
            throw new Error("Custom Error!!!");
        }catch(err){
            return Promise.reject(err);
        }
    }

    static async init(){
        try{
            let dbOutput = await AsyncAwait.dbInit();

            return dbOutput;
        }catch(err){
            return Promise.reject(err);
        }
    }


    static async main(){
        try{
            let output = await AsyncAwait.init();

            console.log(output);
        }catch(err){
            console.log(err);
        }
    }
}

AsyncAwait.main();