const {
    getAllLaunches,
    secheduleNewLaunch,
    existsLaunchWithId,
    deleteLaunch,
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query.js');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpPostNewLaunch(req, res) {
    const { mission, rocket, target, launchDate } = req.body;
    const launch = req.body;

    if (!mission || !rocket || !target || !launchDate) {
        return res.status(404).json({
            error: 'missed a launche property!!',
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(404).json({
            error: 'Invalid launche date!!',
        });
    }
    await secheduleNewLaunch(launch);

    return res.status(201).json(launch);
}

async function httpDeleteLaunche(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(404).json({
            error: 'please provide an id',
        });
    }

    const idNum = Number(id);

    if (isNaN(idNum)) {
        return res.status(404).json({
            error: 'please provide a valid id',
        });
    }
    const exsitingLaunch = await existsLaunchWithId(idNum);
    if (!exsitingLaunch) {
        return res.status(404).json({
            error: 'launch is not found',
        });
    }
    const aborted = await deleteLaunch(idNum);
    if (!aborted) {
        console.log(aborted);
        return res.status(404).json({
            error: 'no launches deleted !',
        });
    } else {
        console.log('new', aborted);
        return res.status(200).json({
            ok: true,
        });
    }
}

module.exports = {
    httpGetAllLaunches,
    httpPostNewLaunch,
    httpDeleteLaunche,
};
