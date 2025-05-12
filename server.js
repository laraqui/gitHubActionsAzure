const http = require('http');
const os = require('os');
const { createClient } = require('redis');

// Configurer Redis
const redisHost = process.env.REDIS_HOST;
const redisPassword = process.env.REDIS_PASSWORD;

const redisClient = createClient({
  url: `rediss://${redisHost}:6380`,
  password: redisPassword,
  socket: {
    tls: true
  }
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

startServer();
