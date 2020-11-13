const mongodb = require('mongodb');

async function load_transactions(req) {
    var url = "mongodb://localhost:27017";

    const client = new mongodb.MongoClient(url);
        
    try{
        //connect
        await client.connect();

        //Establish and verify connection
        //const ping = await client.db("bahamas").command({ ping: 1 });
        const database = client.db("bahamas");
        
        var collection = database.collection("transactions").find({});
        var data = await collection.sort({date: -1}).toArray();


    }  finally {
        //Close connection´
        await client.close();
    } 
    let arr =[];
    for(let i = 0; i < data.length; i++){
        let subArr = [
            data[i].status,
            data[i].date,
            data[i].instrument,
            data[i].action,
            data[i].stake_size_percent,
            data[i].unit_value,
            data[i].currency,
            data[i].open,
            data[i].close,
            data[i].points,
            data[i].profit_loss,
            data[i].pl_percent,
            data[i].created_by_user,
            data[i]._id,
        ]
        arr.push(subArr);
    }
    return arr;
}

async function add_transaction(data){
    //Adjust data
    
    if(data.profit_loss.substring(0, 1) === '-' ){
        //loss
        data["status"] = 'LOSS';
    } else {
        //profit
        data["status"] = 'PROFIT';
    }



    var response = {
        state: false,
        description: ""
    }

    var url = "mongodb://localhost:27017";
    const client = new mongodb.MongoClient(url);
    try{
        await client.connect();
        const database = client.db("bahamas");
        const collection = database.collection("transactions")
        var result = await collection.insertOne(data);
        
        if (result.insertedCount != 0){
            response["description"] = result.insertedCount + " document(s) was inserted";
            response["state"] = true
        }

    } catch (err){
        response["description"] = err;
        console.log(err);
    } finally {
        //Close connection´
        await client.close();
        return response;
    }
}

async function delete_transaction(key){
    //Adjust data
    var response = {
        state: false,
        description: ""
    }

    var url = "mongodb://localhost:27017";
    const client = new mongodb.MongoClient(url);
    try{
        if(key === "" || key === undefined){
            throw "Key was not determined"
        }

        await client.connect();
        const database = client.db("bahamas");
        const collection = database.collection("transactions")
        var result = await collection.deleteOne({_id: new mongodb.ObjectID(key)});
        
        if (result.deletedCount != 0){
            response["description"] = result.deletedCount + " document(s) was deleted";
            response["state"] = true
        }


    } catch (err){
        response["description"] = err;
        console.log(err);
    } finally {
        //Close connection´
        await client.close();
        return response;
    } 
       
}



module.exports = { add_transaction, load_transactions, delete_transaction };
