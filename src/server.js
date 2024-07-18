const PORT = process.env.PORT || 5000;
const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const {mongoConnect} = require('./services/mongo');

await mongoConnect();
const server = http.createServer(app);

await loadPlanetsData();
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function startServer () {
   await mongoConnect();
}
startServer()
