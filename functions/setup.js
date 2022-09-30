import fetch from 'node-fetch'

export default async (db) => {
  databaseService(db)
  // Configure versionService to run every 30 seconds.
  await setInterval(function () { versionService(db) }, 30000)
}

function databaseService (db) {
  if (!db.get('ready')) {
    db.set('ready', true)
    console.info('database: ready for first-time use')
  } else {
    console.info('database: already setup, ignoring')
  }
}

export async function versionService (db) {
  console.info(`version: waiting for response (${new Date().toLocaleTimeString()})`)

  const panelUri = await fetch('https://api.github.com/repos/jexactyl/jexactyl/releases/latest')
  const wingsUri = await fetch('https://api.github.com/repos/pterodactyl/wings/releases/latest')
  const panelVer = await panelUri.json()
  const wingsVer = await wingsUri.json()


  try {
    db.set('panel', (panelVer.tag_name).slice(1))
    db.set('wings',  (wingsVer.tag_name).slice(1))
    db.set('lastSynced', new Date().toLocaleTimeString())
  } catch (e) { console.error() }

  console.info(`version: configured (${db.get('lastSynced')})`)
}
