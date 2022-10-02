export default (ws, db) => {
    ws.get('/', (req, res) => {
        res.json({
            panel: db.get('panel') ?? '...',
            wings: db.get('wings') ?? '...',
            server: {
                syncing: db.get('ready'),
                lastSynced: db.get('lastSynced') ?? '...'
            }
        })
    })

    ws.listen(3000, () => console.info('webserver: started (:3000)'))
}
