const express = require('express');

const {
    httpGetAllLaunches,
    httpPostNewLaunch,
    httpDeleteLaunche,
} = require('./launches.controller.js');
const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpPostNewLaunch);
launchesRouter.delete('/:id', httpDeleteLaunche);

module.exports = launchesRouter;
