const http = require('http');
const app = require('./app.js');
const { loadLaunchData } = require('./models/launches.model.js');
const { loadPlanets } = require('./models/planets.model.js');

const { connectMongo } = require('./services/mongo.js');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
    await connectMongo();
    await loadPlanets();
    await loadLaunchData();
    server.listen(PORT, () => {
        console.log('served on port ', PORT);
    });
}
startServer();
