import fs from 'fs';
import db from './functions/database.js';
import setup from './functions/setup.js';

setup(db);

function createStatusFile() {
  console.log("Criando arquivo...");
  const panel = db.get('panel');
  const wings = db.get('wings');
  const syncing = db.get('ready');
  const lastSynced = db.get('lastSynced');

  // Verificar se algum valor é undefined
  if (panel === undefined || wings === undefined || syncing === undefined || lastSynced === undefined) {
    console.log("Algum valor é indefinido. Tentando novamente em 10 segundos...");
    setTimeout(createStatusFile, 10000); // Chama a função novamente após 10 segundos
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
  fs.writeFile("status.json", json, (err) => {
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
    });
  }, 2000);
}

// Chama a função pela primeira vez
createStatusFile();