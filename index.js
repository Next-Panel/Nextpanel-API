import fs from 'fs';
import db from './functions/database.js';
import jexactyl from './functions/jexactyl.js';
import pterodactyl from './functions/pterodactyl.js';

function createStatusFileJex(callback) {
  try {
    jexactyl(db);
  } catch (err) {
    console.error(err.message);
    return;
  }
  console.log("Criando arquivo...");
  const panel = db.get('panel');
  const wings = db.get('wings');
  const syncing = db.get('ready');
  const lastSynced = db.get('lastSynced');

  // Verificar se algum valor é undefined
  if (panel === undefined || wings === undefined || syncing === undefined || lastSynced === undefined) {
    console.log("Algum valor é indefinido. Tentando novamente em 10 segundos...");
    setTimeout(createStatusFileJex, 10000, callback); // Chama a função novamente após 10 segundos
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
  fs.writeFile("jexactyl.json", json, (err) => {
    if (err) {
      console.error(err.message);
      callback(err);
    } else {
      console.log("Arquivo criado com sucesso");
      // chamar a função createStatusFilePtero após a criação do arquivo jexactyl.json
      createStatusFilePtero(callback);
    }
  });
}

function createStatusFilePtero(callback) {
  pterodactyl(db);
  console.log("Criando arquivo...");
  const panel = db.get('panel');
  const wings = db.get('wings');
  const lastSynced = db.get('lastSynced');

  // Verificar se algum valor é undefined
  if (panel === undefined || wings === undefined || lastSynced === undefined) {
    console.log("Algum valor é indefinido. Tentando novamente em 10 segundos...");
    setTimeout(createStatusFilePtero, 10000, callback); // Chama a função novamente após 10 segundos
    return;
  }

  const data = {
    "daemon": "0.9.999",
    panel,
    wings,
    "sftp": "1.0.5",
    "discord": "https://discord.gg/Wf8Eycz4Tq",
    lastSynced
  };
  const json = JSON.stringify(data, null, 2);
  fs.writeFile("pterodactyl.json", json, (err) => {
    if (err) {
      console.error(err.message);
      callback(err);
    } else {
      console.log("Arquivo criado com sucesso");
    }
  });
}

// Chama a função pela primeira vez
createStatusFileJex(() => {
  console.log('Todas as funções foram executadas com sucesso.');
});