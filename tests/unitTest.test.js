const request = require('supertest');
const http = require('http');
const app = require('../src/app');
const server = http.createServer(app);

describe('POST /register', () => {
  it('should return 200 with success message on successful registration', async () => {
    const response = await request(server)
      .post('/register')
      .query({
        email: 'test@example.com',
        password: 'password',
        profile: 'revendeur'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Création du compte réussie.');
  });

  it('should return 400 with error message if user already exists', async () => {
    const response = await request(server)
      .post('/register')
      .query({
        email: 'test@example.com',
        password: 'password',
        profile: 'revendeur'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Un compte avec cet email existe déjà.');
  });
});
