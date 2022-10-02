require('dotenv').config();

const axios = require('axios');
const Leitura = require('./model/leitura');

const serverType = process.env.SERVER_TYPE

const cloud = axios.create({
  baseURL: "http://localhost:3001",
});

async function sendToCloud() {
    if(serverType == "local") {
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