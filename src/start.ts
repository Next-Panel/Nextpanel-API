import { GitHubRelease } from "./interfaces/github"
import { writeFileSync } from 'fs'

async function start() {
    const panels = [
        { name: 'jexactyl', path: 'Next-Panel/Jexactyl-BR' },
        { name: 'pterodactyl', path: 'Next-Panel/Pterodactyl-BR' }
    ]
    const wings = await fetch(`https://api.github.com/repos/pterodactyl/wings/releases/latest`)
    const wingsData = await wings.json() as GitHubRelease
    if (!wings.ok) throw new Error('Não foi possivel obter as informações das wings, interronpendo...')
    

    for (const { name, path } of panels) {
        const response = await fetch(`https://api.github.com/repos/${path}/releases/latest`)
        const data = await response.json() as GitHubRelease

        if (!response.ok) {
            console.log('Ocorreu um erro ao tentar fazer um request a API do GitHub...')
            continue
        }
        if (typeof data?.tag_name !== 'string') {
            console.log(`Ok... Isso não poderia acontecer, o ${path} não contem um tag_name?!`)
            continue
        }

        const json = JSON.stringify({
            "daemon": "0.9.999",
            "sftp": "1.0.5",
            "discord": "https://discord.gg/Wf8Eycz4Tq",
            "panel": data.tag_name.slice(1),
            "wings": wingsData.tag_name.slice(1),
            lastSynced: new Date().toLocaleTimeString()
        }, null, 2)

        writeFileSync(`version/${name}.json`, json)
    }
}

void start()