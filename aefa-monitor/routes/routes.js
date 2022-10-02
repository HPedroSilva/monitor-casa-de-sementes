const express = require('express');
const router = express.Router();
const Leitura = require('../model/leitura');

module.exports = router;

router.post('/insert', async (req, res) => {
    console.log(req.body);
    const leitura = new Leitura({
        temperatura: req.body.temperatura,
        umidade: req.body.umidade,
        data: new Date()
    })

    try {
        const dataToSave = await leitura.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.post('/cloud-insert', async (req, res) => {
    console.log(req.body);
    const leitura = new Leitura({
        _id: req.body._id,
        temperatura: req.body.temperatura,
        umidade: req.body.umidade,
        data: req.body.data,
        __v: req.body.__v
    })

    try {
        const dataToSave = await leitura.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.post('/test', async (req, res) => {
    console.log(req.body);
    res.json(req.body);
})

router.get('/all', async (req, res) => {
    try{
        const leituras = await Leitura.find();
        res.json(leituras)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/last', async (req, res) => {
    try{
        const leitura = await Leitura.findOne().sort({data: -1});
        res.json(leitura)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})