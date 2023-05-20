require('dotenv').config();

const axios = require('axios');
const Leitura = require('./model/leitura');

const serverType = process.env.SERVER_TYPE
const cloudUrl = process.env.CLOUD_URL

const cloud = axios.create({
  baseURL: cloudUrl,
});

async function sendToCloud() {
    if(serverType == "local") {
        try {
            const notCloudSaved = await Leitura.find({cloudSaved: false});
            for(var leitura of notCloudSaved) {
                try {
                    const response = await cloud.post("cloud-insert", leitura);
                    if(response.data.statusLeitura == 'saved' || response.data.statusLeitura == 'updated') {
                        try {
                            leitura.cloudSaved = true;
                            await leitura.save();
                        } catch(error) {
                            console.log("Erro ao atualizar localmente leitura salva em cloud");
                            console.log(error.message);
                        }
                    }
                } catch(error) {
                    console.log("Erro no envio da leitura para cloud.");
                    console.log(error.message);
                }
            }
        } catch(error) {
            console.log(error.message);
        } 
    }
}

module.exports = sendToCloud;