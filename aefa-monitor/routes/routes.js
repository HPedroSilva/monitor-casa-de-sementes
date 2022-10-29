const express = require('express');
const router = express.Router();
const Leitura = require('../model/leitura');
const sendToCloud = require('../sendToCloud');

module.exports = router;

router.post('/insert', async (req, res) => {
    const leituras = req.body;
    var response = [];
    for(let leitura of leituras) {
        const erro = leitura.erro;
        let leitura_obj = null;
        if(erro == 'OK') {
            leitura_obj = new Leitura({
                erro: 'OK',
                sensorId: leitura.sensorId,
                temperatura: leitura.temperatura,
                umidade: leitura.umidade,
                data: new Date(),
                cloudSaved: false
            });
        } else {
            leitura_obj = new Leitura({
                erro: erro,
                sensorId: leitura.sensorId,
                temperatura: 0,
                umidade: 0,
                data: new Date(),
                cloudSaved: false
            });
        }
        
        try {
            const leituraSalva = await leitura_obj.save();
            response.push(leituraSalva);
        } catch (error) {
            console.log("Erro ao salvar dados: " + leitura_obj);
            console.log(error);
        }
    }
    try {
        res.status(200).json(response);
        sendToCloud();
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.post('/cloud-insert', async (req, res) => {
    const leitura = req.body;
    const leitura_obj = new Leitura({
        _id: leitura._id,
        erro: leitura.erro,
        sensorId: leitura.sensorId,
        temperatura: leitura.temperatura,
        umidade: leitura.umidade,
        data: leitura.data,
        cloudSaved: true,
        __v: leitura.__v
    });

    const leiturasSalvas = await Leitura.find({_id: leitura_obj._id});
    if (leiturasSalvas.length) {
        try {
            const leituraSalva = await leitura_obj.updateOne();
            if(leituraSalva) {
                res.status(200).json({_id: leitura_obj.id, statusLeitura: 'updated'});
            } else {
                res.status(400).json({_id: leitura_obj.id, statusLeitura: 'error'});
            }
        }
        catch (error) {
            res.status(400).json({_id: leitura_obj.id, statusLeitura: 'error', message: error.message});
        }
    } else {
        try {
            const leituraSalva = await leitura_obj.save();
            if(leituraSalva) {
                res.status(200).json({_id: leitura_obj.id, statusLeitura: 'saved'});
            } else {
                res.status(400).json({_id: leitura_obj.id, statusLeitura: 'error'});
            }
        }
        catch (error) {
            res.status(400).json({_id: leitura_obj.id, statusLeitura: 'error', message: error.message});
        }
    }
})

router.post('/test', async (req, res) => {
    res.json(req.body);
})

router.get('/all', async (req, res) => {
    try{
        const leituras = await Leitura.find();
        res.json(leituras);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})

router.get('/last', async (req, res) => {
    const stringSensores = req.query.sensores;
    let valor = parseInt(req.query.qtdLeituras);
    const qtdLeituras = valor ? valor : 1;
    
    var response = [];
    if(stringSensores) {
        var sensoresId = stringSensores.split(',');
        sensoresId = sensoresId.map(Number);

        for(let sensorId of sensoresId)
        {
            try{
                const leitura = await Leitura.find({sensorId: sensorId}, null, {limit: qtdLeituras}).sort({data: -1});
                if(leitura) {
                    response.push(...leitura);
                } else {
                    response.push({sensorId: sensorId, erro: "Not found"});
                }
            }
            catch(error){
                response.push({sensorId: sensorId, erro: error.message});
            }
        }
        res.status(200).json(response);
    } else {
        try{
            const leitura = await Leitura.findOne().sort({data: -1});
            response.push(leitura);
            res.json(response);
        }
        catch(error){
            response.push({message: error.message});
            res.status(500).json(response);
        }
    }
})