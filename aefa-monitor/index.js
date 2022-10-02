require('dotenv').config();

const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const mongoString = process.env.DATABASE_URL
const serverType = process.env.SERVER_TYPE
const refreshRate = process.env.CLOUD_REFRESH_RATE

const cloud = axios.create({
  baseURL: "http://localhost:3000",
});

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
    const app = express();

    app.use(express.json());
    app.use('/', routes);

    app.listen(3000, () => {
        console.log('Server Started at ${3000}');
    });

    if(serverType == 'local'){
        setInterval(sendToCloud, refreshRate);
    }
});

database.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
});
  
// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    database.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    }); 
}); 

async function sendToCloud() {
    // Consultar todos os dados não enviados
    // Enviar dados via post
    const response = await cloud.get("last");
    console.log(response.data);
    const response1 = await cloud.post("cloud-insert", response);
    console.log(response1.data);
}
