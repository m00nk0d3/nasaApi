require('dotenv').config();
const PORT = process.env.PORT || 5000;
const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLauchData } = require('./models/launches.model');
const {mongoConnect} = require('./services/mongo');
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function startServer () {
   await mongoConnect();
   await loadPlanetsData();
   await loadLauchData();
}
startServer()
