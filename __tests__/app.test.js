const request = require('supertest');
const {app} = require('../app');

const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

const connection = require('../db/connection');


beforeEach(() => {
    return seed(testData);
});
afterAll(() => {
    return connection.end();
});

describe('app', () => {
    describe('/api/categories', () => {
        it('200 GET - responds with an array of category objects', () => {
            return request(app)
            .get('/api/categories').expect(200)
            .then(({body}) => {
                expect(body.categories).toBeInstanceOf(Array);
                expect(body.categories).toHaveLength(4);
                body.categories.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                })
            })
        })
    });
});
