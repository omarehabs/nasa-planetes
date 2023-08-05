const req = require('supertest');
const app = require('../../app.js');
const { connectMongo, disconnectMongo } = require('../../services/mongo.js');
const { loadPlanets } = require('../../models/planets.model.js');
const { deleteOne } = require('../../models/planets.mongo.js');

describe('Launches API', () => {
    beforeAll(async () => {
        await connectMongo();
    }, 300000);
    afterAll(async () => {
        await disconnectMongo();
    });
    describe('testing get endpoints', () => {
        test('should get 200 status code', async () => {
            await loadPlanets();
            await req(app).get('/v1/launches').expect(200);
        }, 30000);
    });

    describe('testing post requests', () => {
        test('responses with 200 success', async () => {
            await loadPlanets();
            await req(app)
                .post('/v1/launches')
                .send({
                    mission: 'keploghgujfd',
                    launchDate: 'DEC 26, 2102',
                    rocket: 'myFavRocket',
                    target: 'Kepler-1652 b',
                })
                .expect(201);
        }, 30000);
    });
});
