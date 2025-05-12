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
  await redisClient.connect();

  const server = http.createServer(async (req, res) => {
    // Incrémenter le compteur dans Redis
    let visits = await redisClient.incr('visits');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Nombre de visites : ${visits}</h1>`);
    res.write(`<h2>Serveur : ${os.hostname()}</h2>`);
    res.end();
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Serveur Node.js démarré sur le port ${port}`);
  });
}

startServer();
