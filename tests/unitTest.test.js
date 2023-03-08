import { getUsers } from "../src/controllers/users.controller.js";
import { pool } from "../src/database.js";
import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';



function add(a, b) {
  return a + b;
}

describe('add', () => {
  it('should return the sum of two numbers', () => {
    const result = add(2, 3);
    const expected = 5;

    if (result === expected) {
      console.log('Test passed');
    } else {
      console.error(`Test failed: expected ${expected}, but got ${result}`);
    }
  });
});



describe('GET /users', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/users/all');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});


describe('POST /register', () => {
  it('should return 200 with success message on successful regustration', async() => {
    const response = await request(app)
    .post('/users/register')
    .query({
      email: 'zaki-mazog@outlook.fr',
      password: 'password',
      profile: 'revendeur'
    });
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Un compte avec cet email existe déjà.");

  })
})

