import fs from 'fs';
import db from './functions/database.js';
import setup from './functions/setup.js';

setup(db);

setTimeout(function main() {
  console.log("Criando arquivo...");
  const data = {
    panel: db.get('panel'),
    wings: db.get('wings'),
    server: {
      syncing: db.get('ready'),
      lastSynced: db.get('lastSynced')
    }
  };
  // Validar e escapar os valores antes de inseri-los no JSON
  const json = JSON.stringify(data, null, 2);
  // Usar o método "fs.writeFile()" para não bloquear o processo principal
  fs.writeFile("status.json", json, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Arquivo criado com sucesso");
    }
  });
}, 15000); // Tempo de 15 segundos

// Fechar o banco de dados após 17 segundos
setTimeout(function main() {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Banco de dados parado com sucesso');
    }
  });
}, 17000);