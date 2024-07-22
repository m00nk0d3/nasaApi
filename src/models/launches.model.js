const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        },
      ]
    }
  })

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed")
  }
  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads']
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: new Date(launchDoc['date_local']),
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers: payloads.flatMap((payload) => {
        return payload['customers']
      })
    }
    console.log(`${launch.flightNumber} ${launch.mission} ${launch.rocket} ${launch.launchDate}`)
    await saveLaunch(launch)
  }

}
async function loadLauchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat"
  })
  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }

}


const getAllLaunches = async (skip, limit) => await launches
  .find(
    {},
    { _id: 0, __v: 0 }
  )
  .sort({ flightNumber: 1 })
  .skip(skip)
  .limit(limit);

async function findLaunch(filter) {
  return await launches.findOne(filter)
}
async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestFlightNumber = (await launches.findOne().sort('-flightNumber')).flightNumber;
  if (!latestFlightNumber) {
    return 100;
  }
  return latestFlightNumber;
}
async function saveLaunch(launch) {
  try {
    await launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true }); //upsert is used to create new launches.
  } catch (error) {
    console.log(error)
  }
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })
  if (!planet) {
    throw new Error("No matching planet found")
  }
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber
  })

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId }, {
    upcoming: false,
    success: false
  })
  return aborted.modifiedCount === 1 && aborted.acknowledged
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  loadLauchData,
  abortLaunchById
};
