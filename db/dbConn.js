const dotenv=require('dotenv');
const mongoose=require('mongoose');

dotenv.config();

let database;

const initDB=(callback)=>{
    if(database){
        console.log('Database already initialized');
        return callback(null,database);
    };
    mongoose.connect(process.env.DB_URI).then((client)=>{
        database=mongoose.connection;
        console.log('DATABASE CONNECTED SUCCESSFULLY');
        callback(null,database);
    }).catch((err)=>{
        callback(err);
    });
};


module.exports={
    initDB,
    
};