// Import all of the files and dependencies needed.
import express from 'express'
import ws from './server/server.js'
import db from './functions/database.js'
import setup, { versionService } from './functions/setup.js'

function main () {
  // Set up the initial systems (version control, database etc).
  setup(db)

  if (db.get('ready')) {
    // Launch the server instance; including Express and our DB.
    ws(express(), db)
  }
}

// Start our program here.
main()
