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
                cloudSaved: true
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
    const leitura = new Leitura({
        _id: req.body._id,
        temperatura: req.body.temperatura,
        umidade: req.body.umidade,
        data: req.body.data,
        cloudSaved: true,
        __v: req.body.__v
    });
    const leiturasSalvas = await Leitura.find({_id: leitura._id});
    
    if (leiturasSalvas.length) {
        try {
            const dataToSave = await leitura.updateOne();
            res.status(200).json({_id: leitura.id, statusLeitura: 'updated'});
        }
        catch (error) {
            res.status(400).json({_id: leitura.id, statusLeitura: 'error', message: error.message});
        }
    } else {
        try {
            const dataToSave = await leitura.save();
            res.status(200).json({_id: leitura.id, statusLeitura: 'saved'});
        }
        catch (error) {
            res.status(400).json({_id: leitura.id, statusLeitura: 'error', message: error.message});
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
    try{
        const leitura = await Leitura.findOne().sort({data: -1});
        res.json(leitura);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})