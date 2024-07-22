const { scheduleNewLaunch, getAllLaunches, existsLaunchWithId, abortLaunchById } = require("../../models/launches.model");
const {getPagination} = require("../../services/query");
async function httpGetAllLaunches(req, res) {
  const {skip,limit} = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (!launch.target || !launch.mission || !launch.rocket || !launch.launchDate) {
    return res.status(400).json({
      error: 'Missing required launch property'
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date'
    });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  // converting to a number
  const launchId = +req.params.id;
  // if launch doesn't exist
  const existsLaunch = existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch not found'
    })
  }

  // if launch exists
  const aborted = abortLaunchById(launchId);
  if(!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted'
    })
  }
  return res.status(200).json({ok: true});
}
module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
