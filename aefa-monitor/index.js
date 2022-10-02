require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const mongoString = process.env.DATABASE_URL

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