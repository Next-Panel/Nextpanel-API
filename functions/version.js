/* eslint-disable quote-props */
import fetch from 'node-fetch'

export default async (db) => {
    databaseService(db)
    // Configure versionService to run every 15 seconds.
    await setTimeout(function () { versionService(db) }, 15000)
}

function databaseService (db) {
    if (!db.get('ready')) {
        db.set('ready', true)
        console.info('database: ready for first-time use')
    }
}

export async function versionService (db) {
    console.info(`version: waiting for response (${new Date().toLocaleTimeString()})`)

    const panelResponse = await fetch(url('Next-Panel/Jexactyl-BR'))
    const panelResponse_p = await fetch(url('Next-Panel/Pterodactyl-BR'))
    const wingsResponse = await fetch(url('pterodactyl/wings'))

    if (!panelResponse.ok || !wingsResponse.ok) {
        console.error('Failed to get panel and/or wings version')
        return
    }

    const panel = await panelResponse.json()
    const panel_p = await panelResponse_p.json()
    const wings = await wingsResponse.json()

    if (!panel.tag_name || !panel_p.tag_name || !wings.tag_name) {
        console.error('Failed to parse panel and/or wings version')
        return
    }

    try {
        db.set('panel', panel.tag_name.slice(1))
        db.set('panel_p', panel_p.tag_name.slice(1))
        db.set('wings', wings.tag_name.slice(1))
        db.set('lastSynced', new Date().toLocaleTimeString())
    } catch (e) {
        console.error(e)
    }

    console.info(`version: configured (${db.get('lastSynced')})`)
}

function url (repo) {
    return `https://api.github.com/repos/${repo}/releases/latest`
}
