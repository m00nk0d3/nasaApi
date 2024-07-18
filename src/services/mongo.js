const mongoose = require("mongoose");
const MONGO_URL= 'mongodb+srv://m00nk0d3:umfwtWHQdNIoKbQe@nasacluster.awgsqbd.mongodb.net/nasa?retryWrites=true&w=majority&appName=NASACluster'

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready');
})
mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
    });
}

async function mongoDisconnect() {
    await mongoose.connection.close();
}

module.exports = {  mongoConnect, mongoDisconnect }