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
