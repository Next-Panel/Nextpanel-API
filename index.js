import fs from 'fs';
import db from './functions/database.js';
import jexactyl from './functions/jexactyl.js';
import pterodactyl from './functions/pterodactyl.js';

function createStatusFileJex(callback) {
  jexactyl(db);
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
    } else {
      console.log("Arquivo criado com sucesso");
    }
  });

  // Fechar o banco de dados após 2 segundos
  setTimeout(function main() {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Banco de dados parado com sucesso');
        callback();
      }
    });
  }, 2000);
}

function createStatusFilePtero(callback) {
  pterodactyl(db, () => {
    console.log("Criando arquivo...");
    const panel = db.get('panel');
    const wings = db.get('wings');
    const lastSynced = db.get('lastSynced');

    // Verificar se algum valor é undefined
    if (panel === undefined || wings === undefined || lastSynced === undefined) {
      console.log("Algum valor é indefinido. Tentando novamente em 10 segundos...");
      setTimeout(createStatusFile, 10000); // Chama a função novamente após 10 segundos
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
      } else {
        console.log("Arquivo criado com sucesso");
      }
    });

    // Fechar o banco de dados após 2 segundos
    setTimeout(function main() {
      db.close((err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Banco de dados parado com sucesso');
        }
        callback(); // Chama o callback passado como parâmetro
      });
    }, 2000);
  });
}

// Chama a função pela primeira vez
createStatusFileJex(createStatusFilePtero);