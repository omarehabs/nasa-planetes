const axios = require('axios');

const launchesDB = require('./launches.mongo.js');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 26, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

async function getAllLaunches(skip, limit) {
    return await launchesDB
        .find({}, { __v: 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}
async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB.findOne({}).sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
    await launchesDB.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        },
        launch,
        {
            upsert: true,
        }
    );
}

saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
async function populateLaunches() {
    const res = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    },
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    });
    if (res.status !== 200) {
        console.error('problem download launches data');
        throw new Error('launch data download failed');
    }
    const launchDocs = res.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => payload['customers']);

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers,
        };

        saveLaunch(launch);
    }
}
async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'falconSat',
    });

    if (firstLaunch) {
        console.log('launch data already loaded');
        return;
    } else {
        populateLaunches();
    }

    // console.log(customers);
}
async function secheduleNewLaunch(launch) {
    const planet = await planets.findOne({ keplerName: launch.target });
    if (!planet) {
        throw new Error('No Matching planet found');
    }

    const newFlightNumber = (await getLatestFlightNumber()) + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
    });

    // console.log(newLaunch);
    await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
}

async function existsLaunchWithId(id) {
    return await findLaunch({
        flightNumber: id,
    });
}

async function deleteLaunch(id) {
    const deleted = await launchesDB.updateOne(
        {
            flightNumber: id,
        },
        {
            upcoming: false,
            success: false,
        }
    );
    return deleted.acknowledged && deleted.modifiedCount !== 0;
}

module.exports = {
    getAllLaunches,
    secheduleNewLaunch,
    loadLaunchData,
    deleteLaunch,
    existsLaunchWithId,
};
