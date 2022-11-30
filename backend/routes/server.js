// Programme qui va écouter des requêtes http et y répondre

// TO DO : après avoir exécuté npm init, entry point: server.js

const http = require('http');
const app = require('../app');

app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

/* 
Pour tester:
 const server = http.createServer((req, res) => {
   res.end('Voila la reponse du serveur');
 });
 */

server.listen(process.env.PORT || 3000);
