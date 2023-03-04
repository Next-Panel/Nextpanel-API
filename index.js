// Import all of the files and dependencies needed.
import fs from 'fs'
import express from 'express'
import ws from './server/server.js'
import db from './functions/database.js'
import setup from './functions/setup.js'

let intervalo = null;
let intervalo_file = null;

var startDB = function () {
    intervalo = setTimeout(() => {
        setup(db)

        if (db.get('ready')) {
            // Launch the server instance; including Express and our DB.
            ws(express(), db)
        }
    })
}

var startFile = function () {
    intervalo_file = clearInterval(() => {
        fs.writeFileSync("input.json", (
            (`{"panel":"${db.get('panel')}","wings":"${db.get('wings')}","server":{"syncing":${db.get('ready')},"lastSynced":"${db.get('lastSynced')}"}}`)
        ));
    }, 31000)
}

var stop = function () {
    setTimeout(() => {
        clearTimeout(intervalo)
        clearInterval(intervalo_file)
        console.log('Desligando..');
    }, 35000)
}

startDB();
startFile();
stop();
