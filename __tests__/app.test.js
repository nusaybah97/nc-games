const request = require('supertest');
const {app} = require('../app');
require('jest-sorted')

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
    })
        describe('/api/reviews', () => {
            it('200 GET - responds with an array of review objects ordered by date', () => {
                return request(app)
                .get('/api/reviews').expect(200)
                .then(({body}) => {
                    expect(body.reviews).toBeInstanceOf(Array);
                    expect(body.reviews).toHaveLength(13);
                    body.reviews.forEach((review) => {
                        expect(review).toMatchObject({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(String),
                        })
                    })
                    expect(body.reviews).toBeSortedBy('created_at', {
                        descending: false
                    })
                })

            })
        })
    });
