const express = require("express");
const launchesRouter = express.Router();
const {
  httpAddNewLaunch,
  httpGetAllLaunches,
  httpAbortLaunch
} = require("./launches.controller");

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch)
module.exports = launchesRouter;
