// Import all of the files and dependencies needed.
import fs from 'fs'
//import express from 'express'
//import ws from './server/server.js'
import db from './functions/database.js'
import setup from './functions/setup.js'

setup(db)

setTimeout(function main() {
console.log("Arquivo Criado")
fs.writeFileSync("status.json", (`{
  "panel": "${db.get('panel')}",
  "wings": "${db.get('wings')}",
  "server": {
    "syncing": ${db.get('ready')},
    "lastSynced": "${db.get('lastSynced')}"
  }
}`)
)}, 13000)
 
setTimeout(function main() {
db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Banco de dados parado com sucesso');
    }
  })}, 15000
)
