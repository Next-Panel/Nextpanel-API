import fs from 'fs';
import db from './functions/database.js';
import version from './functions/version.js';

function createStatusFile() {
  try {
    version(db);
  } catch (err) {
    console.error(err.message);
    return;
  }
  console.log("Criando arquivos...");
  const panel = db.get('panel');
  const panel_p = db.get('panel_p');
  const wings = db.get('wings');
  const syncing = db.get('ready');
  const lastSynced = db.get('lastSynced');

  if (panel === undefined || panel_p === undefined || wings === undefined || syncing === undefined || lastSynced === undefined) {
    console.log("Algum valor é indefinido. Tentando novamente em 10 segundos...");
    setTimeout(createStatusFile, 10000);
    return;
  }

  const data = {
    panel,
    wings,
    server: {
      syncing,
      lastSynced
    }
  };
  const json = JSON.stringify(data, null, 2);
  fs.writeFile("/version/jexactyl.json", json, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Arquivo jexactyl.json criado com sucesso");
    }
  });

  const data_p = {
    "daemon": "0.9.999",
    "panel": db.get('panel_p'),
    wings,
    "sftp": "1.0.5",
    "discord": "https://discord.gg/Wf8Eycz4Tq",
    lastSynced
  };
  const json_p = JSON.stringify(data_p, null, 2);
  fs.writeFile("/version/pterodactyl.json", json_p, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Arquivo pterodactyl.json criado com sucesso");
    }
  });
}

createStatusFile();