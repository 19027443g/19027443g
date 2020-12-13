const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kfling:L900622kfp+@cluster0.hjq8z.mongodb.net/mydb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});

module.exports = client;