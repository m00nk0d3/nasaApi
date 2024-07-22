const express = require("express");
const api = express.Router();

api.use("/planets", require("./planets/planets.router"));
api.use("/launches", require("./launches/launches.router"));

module.exports = api