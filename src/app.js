const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
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
app.use("/planets", require("./routes/planets/planets.router"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/launches", require("./routes/launches/launches.router"));
module.exports = app;
