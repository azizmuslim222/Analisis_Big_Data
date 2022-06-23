const { ObjectId } = require('mongodb');
const config = require('../config.json');

module.exports = async(conn, patientId) => {
    var id = new ObjectId();
    let identifiersPromises = [];
    let namesPromises = [];
    let telecomsPromises = [];
    let birthdate = 'unknown';
    let addressPromises = [];
    config.map.patient.identifier.forEach((it) => {
        identifiersPromises.push(
            new Promise((resolve, reject) => {
                conn.query(`SELECT ${it.fieldName} FROM ${it.tableName} where id = '${patientId}'`, (err, results) => {
                    if (err) return reject(err)
                    resolve({
                        data: results[0],
                        fieldName: it.fieldName,
                        use: it.use
                    })
                })
            })
        );
    })


    const identifiers = await Promise.all(identifiersPromises.map(async(it) => {
        let res = await it;
        return res;
    }))

    config.map.patient.name.forEach((it) => {
        namesPromises.push(
            new Promise((resolve, reject) => {
                conn.query(`SELECT ${it.fieldName} FROM ${it.tableName} where id = '${patientId}'`, (err, results) => {
                    if (err) return reject(err)
                    resolve({
                        data: results[0],
                        fieldName: it.fieldName
                    })
                })
            })
        );
    })

    const names = await Promise.all(namesPromises.map(async(it) => {
        let res = await it;
        return res;
    }))

    config.map.patient.telecom.forEach((it) => {
        telecomsPromises.push(
            new Promise((resolve, reject) => {
                conn.query(`SELECT ${it.fieldName} FROM ${it.tableName} where id = '${patientId}'`, (err, results) => {
                    if (err) return reject(err)
                    resolve({
                        data: results[0],
                        fieldName: it.fieldName
                    })
                })
            })
        );
    })

    const telecoms = await Promise.all(telecomsPromises.map(async(it) => {
        let res = await it;
        return res;
    }))

    const gender = await new Promise((resolve, reject) => {
        conn.query(`SELECT ${config.map.patient.gender.fieldName} FROM ${config.map.patient.gender.tableName} where id = '${patientId}'`, (err, results) => {
            if (err) return reject(err)
            resolve({
                data: results[0],
                fieldName: config.map.patient.gender.fieldName
            })
        })
    })

    if (config.map.patient.birthDate) {
        birthdate = await new Promise((resolve, reject) => {
            conn.query(`SELECT ${config.map.patient.birthDate.fieldName} FROM ${config.map.patient.birthDate.tableName} where id = '${patientId}'`, (err, results) => {
                if (err) return reject(err)
                resolve({
                    data: results[0],
                    fieldName: config.map.patient.birthDate.fieldName
                })
            })
        })
    }

    config.map.patient.address.forEach((it) => {
        addressPromises.push(
            new Promise((resolve, reject) => {
                conn.query(`SELECT ${it.fieldName} FROM ${it.tableName} where id = '${patientId}'`, (err, results) => {
                    if (err) return reject(err)
                    resolve({
                        data: results[0],
                        fieldName: it.fieldName
                    })
                })
            })
        );
    })

    const address = await Promise.all(addressPromises.map(async(it) => {
        let res = await it;
        return res;
    }))

    return {
        "resourceType": "Patient",
        "id": id,
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: f001</p><p><b>identifier</b>: 738472983 (USUAL), ?? (USUAL)</p><p><b>active</b>: true</p><p><b>name</b>: Pieter van de Heuvel </p><p><b>telecom</b>: ph: 0648352638(MOBILE), p.heuvel@gmail.com(HOME)</p><p><b>gender</b>: male</p><p><b>birthDate</b>: 17/11/1944</p><p><b>deceased</b>: false</p><p><b>address</b>: Van Egmondkade 23 Amsterdam 1024 RJ NLD (HOME)</p><p><b>maritalStatus</b>: Getrouwd <span>(Details : {http://hl7.org/fhir/v3/MaritalStatus code 'M' = 'Married', given as 'Married'})</span></p><p><b>multipleBirth</b>: true</p><h3>Contacts</h3><table><tr><td>-</td><td><b>Relationship</b></td><td><b>Name</b></td><td><b>Telecom</b></td></tr><tr><td>*</td><td>Emergency Contact <span>(Details : {http://hl7.org/fhir/v2/0131 code 'C' = 'Emergency Contact)</span></td><td>Sarah Abels </td><td>ph: 0690383372(MOBILE)</td></tr></table><h3>Communications</h3><table><tr><td>-</td><td><b>Language</b></td><td><b>Preferred</b></td></tr><tr><td>*</td><td>Nederlands <span>(Details : {urn:ietf:bcp:47 code 'nl' = 'Dutch', given as 'Dutch'})</span></td><td>true</td></tr></table><p><b>managingOrganization</b>: <a>Burgers University Medical Centre</a></p></div>"
        },
        "identifier": identifiers.map((it) => ({
            "use": it.use,
            "system": "urn:oid:2.16.840.1.113883.2.4.6.3",
            "value": it.data[it.fieldName]
        })),
        "active": true,
        "name": names.map((it) => ({
            "use": "usual",
            "family": it.data[it.fieldName],
            "given": [
                it.data[it.fieldName]
            ],
            "suffix": [
                "MSc"
            ]
        })),
        "telecom": telecoms.map((it) => ({
            "system": "phone",
            "value": it.data[it.fieldName],
            "use": "mobile"
        })),
        "gender": gender.data[gender.fieldName] == 'M' || gender.data[gender.fieldName] == 0 ? "male" : "female",
        "birthDate": birthdate,
        "deceasedBoolean": false,
        "address": address.map((it) => ({
            "use": "home",
            "line": [
                it.data[it.fieldName]
            ],
            "city": "unknown",
            "postalCode": "unknown",
            "country": "unknown"
        })),
        "maritalStatus": {},
        "multipleBirthBoolean": true,
        "contact": [],
        "communication": [],
        "managingOrganization": {}
    }
}