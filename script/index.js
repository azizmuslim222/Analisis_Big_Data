var express = require('express');
const mysql = require('mysql2');
const patientMapper = require('./mappers/patient');
const config = require('./config.json');

var app = express();



const connection = mysql.createConnection({
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.password,
    database: config.connection.db
});

app.get('/fhir/patient', (req, res) => {
    connection.query(
        'SELECT * FROM `patients`',
        async function(err, results) {
            const patients = await Promise.all(results.map(async(it) => {
                let pat = await patientMapper(connection, it.id);
                return pat;
            }))
            res.json(patients)
        }
    );
})

app.get('/fhir/patient/:id', (req, res) => {
    connection.query(
        `SELECT * FROM patients where id=${req.params.id}`,
        async function(err, results, fields) {
            console.log(results);
            const patients = await Promise.all(results.map(async(it) => {
                let pat = await patientMapper(connection, it.id);
                return pat;
            }))
            res.json(patients)
        }
    );
})

app.listen(4444, () => {
    console.log(`Example app listening on port 4444`)
});