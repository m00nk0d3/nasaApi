const launches = require("./launches.mongo");
const planets = require("./planets.mongo");


const getAllLaunches = async () => await launches
  .find(
    {},
    { _id: 0, __v: 0 }
  );

async function existsLaunchWithId(launchId) {
  return await launches.findOne({ flightNumber: launchId })
}

async function getLatestFlightNumber() {
  const latestFlightNumber = (await launches.findOne().sort('-flightNumber')).flightNumber;
  if (!latestFlightNumber) {
    return 100;
  }
  return latestFlightNumber;
}
async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })
  console.log(planet)
  if (!planet) {
    throw new Error("No matching planet found")
  }
  try {
    await launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true }); //upsert is used to create new launches.
  } catch (error) {
    console.log(error)
  }
}

async function scheduleNewLaunch(launch) {
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
  abortLaunchById
};
