// Import all of the files and dependencies needed.
import fs from 'fs'
import express from 'express'
import ws from './server/server.js'
import db from './functions/database.js'
import setup from './functions/setup.js'

var startIntervalDB = setTimeout(function main() {
    // Set up the initial systems (version control, database etc).
    setup(db)

    if (db.get('ready')) {
        // Launch the server instance; including Express and our DB.
        ws(express(), db)
    }
})

var refreshIntervalId = setInterval(function () {
        fs.writeFileSync("input.json",  (
            (`{"panel":"${db.get('panel')}","wings":"${db.get('wings')}","server":{"syncing":${db.get('ready')},"lastSynced":"${db.get('lastSynced')}"}}`)
        ));
    }, 31000)
setInterval(function () {
    console.log("Desligando...")
    clearInterval(refreshIntervalId);
    clearTimeout(startIntervalDB);
}, 35000)
