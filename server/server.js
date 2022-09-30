import { versionService } from '../functions/setup.js'

export default (ws, db) => {
  ws.get('/', (req, res) => {
    res.json({
      panel: db.get('panel') ?? 'waiting for sync...',
      wings: db.get('wings') ?? 'waiting for sync...',
      server: {
        syncing: db.get('ready'),
        lastSynced: db.get('lastSynced')
      }
    })
  })

  ws.listen(3000, () => console.info(`webserver: started (:3000)`))
}
