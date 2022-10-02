const express = require('express');
const router = express.Router();
const Leitura = require('../model/leitura');
const sendToCloud = require('../sendToCloud');

module.exports = router;

router.post('/insert', async (req, res) => {
    const leitura = new Leitura({
        temperatura: req.body.temperatura,
        umidade: req.body.umidade,
        data: new Date(),
        cloudSaved: false
    });

    try {
        const dataToSave = await leitura.save();
        res.status(200).json(dataToSave);
        sendToCloud();
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

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