import { pool } from "../src/database.js";
import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import { getUsers, test,login,register,getUsersFromCRM,ValidateApiKey } from "../src/controllers/users.controller.js";
import { getCustomerOrders} from "../src/controllers/commandes.controller.js";
import MockAdapter from 'axios-mock-adapter';
import crypto from 'crypto';


function generateToken() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
}

function hashPassword(password) {
  const hash = crypto.pbkdf2Sync(password, 'mySecret', 10000, 64, 'sha512').toString('hex');
  return {
    hash: hash
  };
}




describe('GET /users', () => {
  it('should return all users', async () => {
    const res = await request(app)
      .get('/users/all')
      .timeout(5000); // Ajout du timeout de 5 secondes
      
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});



describe('POST /register', () => {
  it('should return 400 with error message if user already exists', async () => {
    const response = await request(app)
      .post('/users/register')
      .timeout(5000)
      .query({
        email: 'zaki-mazog@outlook.fr',
        password: 'password',
        profile: 'revendeur'
      });
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Un compte avec cet email existe déjà.");
  });

  
  it('should return 200 success message on successful registration', function (done) {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let email = '';
      for (let i = 0; i < 10; i++) {
        email += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      email += '@example.com';

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

  
});

describe('generateToken', () => {
  it('should generate a random token of length 64', () => {
    const token = generateToken();
    expect(token).to.have.lengthOf(64);
  });
});


describe('hashPassword', () => {
  it('should return a hashed password', () => {
    const password = 'password123';
    const hashedPassword = hashPassword(password);

    expect(hashedPassword.hash).to.be.a('string');
    expect(hashedPassword.hash).to.have.lengthOf(128);
  });
});

describe('Database connection', () => {
  it('should connect to the database', async () => {
    try {
      await pool.query('SELECT 1+1');
    } catch (error) {
      throw new Error('Unable to connect to database');
    }
  });
});


describe('getCustomerOrders', () => {
  it('should return an array of orders for a customer', async () => {
    // Mock the axios.get method to return a specific response
    const mockResponse = { data: [{ id: 1, customer_id: 123, total: 100 }, { id: 2, customer_id: 123, total: 200 }] };
    sinon.stub(axios, 'get').resolves(mockResponse);

    // Call the method with a specific customer ID
    const customerId = 123;
    const orders = await getCustomerOrders(customerId);

    // Verify that the axios.get method was called with the correct URL
    expect(axios.get.calledWith(`https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers/${customerId}/orders`)).to.be.true;

    // Verify that the orders returned match the mock response
    expect(orders).to.deep.equal(mockResponse.data);

    // Restore the axios.get method to its original implementation
    axios.get.restore();
  });

});


describe("GET /customers/:customerId/:apiKey", () => {
  it("should return 401 unauthorized if API key is invalid", async () => {
    const apiKey = "invalid_key";
    const customerId = 8;

    const keyQueryStub = sinon.stub(pool, "query").returns({
      rowCount: 0,
    });

    const response = await request(app)
    .get(`/orders/customers/${customerId}/${apiKey}`)
    .expect(401);

    expect(response.body.message).to.equal("Accès refusé. Clé API invalide.");

    keyQueryStub.restore();
  });


  it("should return 500 internal server error if an error occurs", async () => {
    const apiKey = "6902e7c064ede2b395d56bb698cb4fcaf920fe068c0a68e08b0d8aeb33f7d770";
    const customerId = 8;

    const keyQueryStub = sinon.stub(pool, "query").throws(new Error("Database error"));

    const response = await request(app)
      .get(`/orders/customers/${customerId}/${apiKey}`)
      .expect(500);

    expect(response.text).to.equal("Erreur lors de la récupération des commandes.");

    keyQueryStub.restore();
  });
});


describe("GET /login", () => {
  
  it("should return 'Utilisateur inconnu' if email not found in database", async () => {
    const email = "unknown@example.com";
    const password = "password";

    const queryStub = sinon.stub(pool, "query").resolves({
      rowCount: 0
    });

    const response = await request(app)
      .get("/users/login")
      .send({ email, password })
      .expect(200);

    expect(response.body.message).to.equal("Utilisateur inconnu");

    queryStub.restore();
  });


  it("should return 'OK' if login is successful and token_session is not null", async () => {
    const email = "zaki-mazog@outlook.fr";
    const password = 'test';

    const response = await request(app)
    .get("/users/login")
    .query({
      email: email,
      password: password
    })
    .expect(200);

    expect(response.body.message).to.equal("OK");

  });

  it("should return 'Mot de passe incorrect' if password is incorrect", async () => {
    const email = "zaki-mazog@outlook.fr";
    const password = "wrongpassword";

    const response = await request(app)
      .get("/users/login")
      .query({
        email: email,
        password: password
      })
      .expect(200);

    expect(response.body.message).to.equal("Mot de passe incorrect");

  });


  it("should return 500 if an error occurs", async () => {
    const email = "user@example.com";
    const password = "correctpassword";

    const queryStub = sinon.stub(pool, "query").rejects(new Error("Database error"));

    const response = await request(app)
      .get("/users/login")
      .send({ email, password })
      .expect(500);

    expect(response.body.message).to.equal("Erreur lors de la recherche de l'utilisateur");

    queryStub.restore();
  });


});

