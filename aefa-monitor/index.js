require('dotenv').config();

const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const mongoString = process.env.DATABASE_URL
const serverType = process.env.SERVER_TYPE
const refreshRate = process.env.CLOUD_REFRESH_RATE

const Leitura = require('./model/leitura');

const cloud = axios.create({
  baseURL: "http://localhost:3001",
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
    console.log(("#".repeat(40) + "\n").repeat(3));
    try {
        const notCloudSaved = await Leitura.find({cloudSaved: false});
        for(var leitura of notCloudSaved) {
            console.log(leitura);
            try {
                const response = await cloud.post("cloud-insert", leitura);
                console.log(response.data.statusLeitura);
                if(response.data.statusLeitura == 'saved' || response.data.statusLeitura == 'updated') {
                    try {
                            console.log("Entrou");
                            leitura.cloudSaved = true;
                            await leitura.save();
                        }
                        catch(error) {
                            console.log("Erro ao atualizar localmente leitura salva em cloud");
                            console.log(error.message);
                        }
                }
            }
            catch(error) {
                console.log("Erro no envio da leitura para cloud.");
                console.log(error.message);
            }
        }
    }
    catch(error) {
        console.log(error.message);
    }
}
