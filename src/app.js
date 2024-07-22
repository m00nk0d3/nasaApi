const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const api = require("./routes/api");
const app = express();
// Middleware to allow cross-origin requests
app.use(
  cors({
    origin: "http://localhost",
  }),
);

//logs requests
app.use(morgan("combined"));

app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use('/v1',api);

module.exports = app;
