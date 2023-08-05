const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');

const planets = require('./planets.mongo.js');

const habitablePlanets = (planet) => {
    return (
        planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 &&
        planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6
    );
};

function loadPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(
            path.join(__dirname, '..', '..', 'data', 'planets.csv')
        )
            .pipe(parse.parse({ comment: '#', columns: true }))
            .on('data', async (data) => {
                if (habitablePlanets(data)) {
                    await savePlanet(data);
                }
            })
            .on('error', (error) => {
                console.log(error);
                reject(err);
            })
            .on('end', async () => {
                console.log('done!');
                console.log((await getAllPlanets()).length);
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planets.find(
        {},
        {
            __v: 0,
        }
    );
}

async function savePlanet(data) {
    try {
        await planets.updateOne(
            {
                keplerName: data.kepler_name,
            },
            {
                keplerName: data.kepler_name,
            },
            {
                upsert: true,
            }
        );
    } catch (e) {
        console.error('could nor save a planet', e);
    }
}
module.exports = { getAllPlanets, loadPlanets };
