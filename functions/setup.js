/* eslint-disable quote-props */
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
    }
}

export async function versionService (db) {
    console.info(`version: waiting for response (${new Date().toLocaleTimeString()})`)

    const panel = await (await fetch(url('Next-Panel/Jexactyl-BR'))).json()
    const wings = await (await fetch(url('pterodactyl/wings'))).json()

    try {
        db.set('panel', (panel.tag_name).slice(1))
        db.set('wings', (wings.tag_name).slice(1))
        db.set('lastSynced', new Date().toLocaleTimeString())
    } catch (e) {
        console.error(e)
    }

    console.info(`version: configured (${db.get('lastSynced')})`)
}

function url (repo) {
    return `https://api.github.com/repos/${repo}/releases/latest`
}
