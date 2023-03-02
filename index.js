// Import all of the files and dependencies needed.
import fs from 'fs'
import express from 'express'
import ws from './server/server.js'
import db from './functions/database.js'
import setup from './functions/setup.js'

function main() {
    // Set up the initial systems (version control, database etc).
    setup(db)

    if (db.get('ready')) {
        // Launch the server instance; including Express and our DB.
        ws(express(), db)
    }
    setInterval(function () {
        fs.writeFileSync("input.json", JSON.stringify(
            `{"panel":"${db.get('panel')}","wings":"${db.get('wings')}","server":{"syncing":${db.get('ready')},"lastSynced":"${db.get('lastSynced')}"}}`
            //`{"panel":"` + `${db.get('panel')}` + `","wings":"` + `${db.get('wings')}` + `","server":{"syncing":` + `${db.get('ready')}` + `,"lastSynced":"` + `${db.get('lastSynced')}` + `"}}`
        ));
    },
        10000)
}

// Start our program here.
main()
