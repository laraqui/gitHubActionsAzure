require('dotenv').config();
const express = require('express');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Redis sécurisée
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6380,
    tls: true,
  },
  password: process.env.REDIS_PASSWORD
});

// Connexion Redis
client.connect()
  .then(() => console.log('✅ Connecté à Redis'))
  .catch((err) => console.error('Erreur Redis', err));

app.get('/', async (req, res) => {
  try {
    const visits = await client.incr('counter');
    res.send(`Nombre de visites : ${visits}`);
  } catch (err) {
    res.status(500).send('Erreur Redis');
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

redisClient.on('error', (err) => console.error('Erreur Redis', err));

async function startServer() {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Impossible de se connecter à Redis:', err);
  }

  const server = http.createServer(async (req, res) => {
    let visits = 'Indisponible';
    try {
      if (redisClient.isOpen) {
        visits = await redisClient.incr('visits');
      }
    } catch (err) {
      console.error('Erreur lors de l’incrément Redis:', err);
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Nombre de visites : ${visits}</h1>`);
    res.write(`<h2>Serveur : ${os.hostname()}</h2>`);
    res.end();
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Serveur - Node.js démarré sur le port ${port}`);
  });
}


