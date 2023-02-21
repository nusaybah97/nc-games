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
                    })                    })
                expect(body.reviews).toBeSortedBy('created_at', {
                    descending: true
                })
            })
        })
    })
    describe('api/reviews/:review_id', () => {
        it('200 GET - responds with a review object', () => {
            return request(app)
            .get('/api/reviews/3').expect(200)
            .then(({body}) => {
                expect(typeof body.review).toBe('object')
                expect(body.review).toEqual({
                    review_id: 3,
                    title: 'Ultimate Werewolf',
                    review_body: "We couldn't find the werewolf!",
                    designer: 'Akihisa Okui',
                    review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                    votes: 5,
                    category: 'social deduction',
                    owner: 'bainesface',
                    created_at: '2021-01-18T10:01:41.251Z',
                })
            })
        });
        it('400: GET- responds with message for invalid review_id', () => {
            return request(app)
            .get('/api/reviews/invalid-review_id')
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe('That is not a valid request!');
            })
        });
        it('404: GET - responds with a message for a valid but non existent review_id', () => {
            return request(app)
            .get('/api/reviews/1000')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Sorry Not Found :(')
            });
        });
    });
});
