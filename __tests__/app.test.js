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
    describe('/api/non-existent-path', () => {
        it('404: responds with message when sent an invalid path ', () => {
            return request(app)
            .get('/no-a-valid-path')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Invalid Path!')
            })
        });
    });
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
                    descending: true
                })
            })
        })
        describe('/api/reviews - (queries)', () => {
            it('200: GET -responds with an array of reviews with specified category', () => {
                return request(app)
                .get('/api/reviews?category=dexterity')
                .expect(200)
                .then(({body}) => {
                    expect(body.reviews).toBeInstanceOf(Array)
                    expect(body.reviews).toHaveLength(1)
                    body.reviews.forEach((review) => {
                        expect(review).toMatchObject({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: 'dexterity',
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(String),
                        })
                    })
                })
            });
            it('200: GET- responds with an array of reviews with specified sorty_by', () => {
                return request(app)
                .get('/api/reviews?sort_by=votes')
                .expect(200)
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
                expect(body.reviews).toBeSortedBy('votes', {
                    descending: true
                })
                })
            });
            it('200: GET- responds with an array of reviews with specified order', () => {
                return request(app)
                .get('/api/reviews?sort_by=votes&order=asc')
                .expect(200)
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
                expect(body.reviews).toBeSortedBy('votes', {
                    descending: false
                })
                })
            });
            it('200: GET- responds with an empty array when category is valid but has no reviews', () => {
                return request(app)
                .get("/api/reviews?category=children's games")
                .expect(200)
                .then(({body}) => {
                    expect(body.reviews).toHaveLength(0)
                    expect(body.reviews).toEqual([])
                })
            })
            it('400: GET- responds with error message when invalid sort_by is given', () => {
                return request(app)
                .get('/api/reviews?sort_by=invalid')
                .expect(400)
                .then(({body}) => {
                    expect(body.message).toBe('That is not a valid request!')
                })
            });
            it('400: GET- responds with error message when ivalid order is given', () => {
                return request(app)
                .get('/api/reviews?order=invalid')
                .expect(400)
                .then(({body}) => {
                    expect(body.message).toBe('That is not a valid request!')
                })
            });
            it('404: GET- responds with message when category does not exist', () => {
                return request(app)
                .get('/api/reviews?category=invalid')
                .expect(404)
                .then(({body}) => {
                    expect(body.message).toBe('Sorry Not Found :(')
                })
            });
        });
    })
    describe('api/reviews/:review_id', () => {
        it('200 GET - responds with a review object containing comment_count property', () => {
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
                    comment_count: '3'
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
    describe('/api/reviews/:review_id/comments - GET', () => {
        it('200: GET- responds with an array of comments for given review_id', () => {
            return request(app)
            .get('/api/reviews/3/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toBeInstanceOf(Array);
                expect(body.comments).toHaveLength(3)
                body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: 3,
                    })
                })
                expect(body.comments).toBeSortedBy('created_at', {descending: true});
                

            })
        });
        it('200: GET- responds with an empty array when review_id exists but has no comments', () => {
            return request(app)
            .get('/api/reviews/5/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([]);
            })
        })
        it('400: GET- responds with message for invalid review_id', () => {
            return request(app)
            .get('/api/reviews/invalid-review_id/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe('That is not a valid request!')
            })
        });
        it('404: GET- responds with message when review_id is valid but does not exist', () => {
            return request(app)
            .get('/api/reviews/1000/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Sorry Not Found :(');
            }) 
        })
    });
    describe('/api/reviews/:review_id/comments - POST', () => {
        it('201: POST- responds with the posted comment', () => {
            const requestBody = {username: 'mallionaire', body: 'My kids loved this game!'}
            return request(app)
            .post('/api/reviews/6/comments')
            .send(requestBody)
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toEqual({
                    comment_id: 7,
                    body: 'My kids loved this game!',
                    votes: 0,
                    author: 'mallionaire',
                    review_id: 6,
                    created_at: expect.any(String),
                })
            })
        });
        it('201: POST- responds with posted comment even when post contains extra properties', () => {
            const requestBody = {username: 'mallionaire', body: 'My kids loved this game!', votes: 20}
            return request(app)
            .post('/api/reviews/5/comments')
            .send(requestBody)
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toEqual({
                        comment_id: 7,
                        body: 'My kids loved this game!',
                        votes: 0,
                        author: 'mallionaire',
                        review_id: 5,
                        created_at: expect.any(String),
                })
            })
        });
        it('400: POST- responds with message for invalid review_id', () => {
            const requestBody = {username: 'mallionaire', body: 'My kids loved this game!'};
            return request(app)
            .post('/api/reviews/invalid-review_id/comments')
            .send(requestBody)
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe('That is not a valid request!')
            })
        });
        it('400: POST- responds with message when an invalid post is made', () => {
            const requestBody = {username: 'mallionaire'}
            return request(app)
            .post('/api/reviews/6/comments')
            .send(requestBody)
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe('That is not a valid request!')
            })
        });
        it('404: POST- responds with message when review_id is valid but doesnt exist', () => {
            const requestBody = {username: 'mallionaire', body: 'My kids loved this game!'};
            return request(app)
            .post('/api/reviews/1000/comments')
            .send(requestBody)
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Sorry Not Found :(')
            })
        })
        it('404: POST- responds with a message when the username doesnt exist', () => {
            const requestBody = {username: 'nonUser', body: 'Any comments'}
            return request(app)
            .post('/api/reviews/3/comments')
            .send(requestBody)
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Sorry Not Found :(')
            })
        });
    });
    describe('/api/reviews/:review_id', () => {
        it('200: PATCH- responds with the updated review with increased votes', () => {
            const requestBody = {inc_votes: 5};
            return request(app)
            .patch('/api/reviews/4')
            .send(requestBody)
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    review_id: 4,
                        title: 'Dolor reprehenderit',
                        designer: 'Gamey McGameface',
                        owner: 'mallionaire',
                        review_img_url:
                          'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700',
                        review_body:
                          'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
                        category: 'social deduction',
                        created_at: expect.any(String),
                        votes: 12
                })
            })
        })
        it('200: PATCH- responds with the updated review with decreased votes', () => {
            const requestBody = {inc_votes: -4}
            return request(app)
            .patch('/api/reviews/4')
            .send(requestBody)
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    
                        review_id: 4,
                        title: 'Dolor reprehenderit',
                        designer: 'Gamey McGameface',
                        owner: 'mallionaire',
                        review_img_url:
                          'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700',
                        review_body:
                          'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
                        category: 'social deduction',
                        created_at: expect.any(String),
                        votes: 3
                      
                })
            })
        });
        it('200: PATCH- responds with an updated review when request contains extra properties', () => {
            const requestBody = {inc_votes: 20, owner: 'Me'}
            return request(app)
            .patch('/api/reviews/2')
            .send(requestBody)
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                      'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: expect.any(String),
                    votes: 25
                })
            })
        });
        it('400: PATCH- responds with message for invalid review id', () => {
            const requestBody = {inc_votes: 20};
            return request(app)
            .patch('/api/reviews/invalid-review_id')
            .send(requestBody)
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe('That is not a valid request!')
            })
        })
        it('400: PATCH- responds with message when an invalid request is made', () => {
            const requestBody = {category: 'New'};
            return request(app)
            .patch('/api/reviews/5')
            .send(requestBody)
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe('That is not a valid request!')
            })
        });
        it('404: POST- responds with message when review_id is valid but does not exist', () => {
            const requestBody = {inc_votes: 5};
            return request(app)
            .patch('/api/reviews/1000')
            .send(requestBody)
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Sorry Not Found :(')
            })
        });
    });
    describe('/api/users', () => {
        it('200 GET - responds with an array of user objects', () => {
            return request(app)
            .get('/api/users').expect(200)
            .then(({body}) => {
                expect(body.users).toBeInstanceOf(Array);
                expect(body.users).toHaveLength(4);
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        })
    })
});
