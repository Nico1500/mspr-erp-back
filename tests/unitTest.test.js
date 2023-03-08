import { getUsers } from "../src/controllers/users.controller.js";
import { pool } from "../src/database.js";
import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';
import faker from 'faker';





describe('GET /users', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/users/all');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});


describe('POST /register', () => {
  it('should return 400 with error message if user already exists', async () => {
    const response = await request(app)
      .post('/users/register')
      .query({
        email: 'zaki-mazog@outlook.fr',
        password: 'password',
        profile: 'revendeur'
      });
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Un compte avec cet email existe déjà.");
  });

  
  it('should return 200 success message on successful registration', function (done) {
    const email = faker.internet.email();
    request(app)
      .post('/users/register')
      .query({
        email: email,
        password: 'password',
        profile: 'revendeur'
      })
      .timeout(5000)
      .end((err, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Création du compte réussie.");
        done(err);
      });
  });
});


describe('getUsersFromCRM', () => {
  it('should return the list of customers from the CRM API', async () => {
    const mockCustomers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];
    const axiosGetStub = sinon.stub(axios, 'get').resolves({ data: mockCustomers });

    const customers = await getUsersFromCRM();

    expect(customers).to.deep.equal(mockCustomers);
    expect(axiosGetStub.calledOnceWith('https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers')).to.be.true;

    axiosGetStub.restore();
  });

  it('should log an error if the API call fails', async () => {
    const axiosGetStub = sinon.stub(axios, 'get').rejects(new Error('API error'));

    const logSpy = sinon.spy(console, 'error');

    const customers = await getUsersFromCRM();

    expect(customers).to.be.undefined;
    expect(logSpy.calledOnceWith(sinon.match(/API error/))).to.be.true;

    axiosGetStub.restore();
    logSpy.restore();
  });
});
