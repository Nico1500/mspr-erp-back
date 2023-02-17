const axios = require('axios');
const request = require('supertest');
const { getAllProducts } = require('../src/controllers/produits.controller');
const { register, login, getUsers } = require('../src/controllers/users.controller');
const { pool } = require('../src/database');

const app = require('../src/app');
const port = 3000;

let server;

beforeAll(() => {
  server = app.listen(port);
});

afterAll(async () => {
  await server.close();
});
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
describe('Tests d\'intégration pour la fonction getAllProducts', () => {
  test('Test de la fonction getAllProducts', async () => {
    // Appeler la fonction getAllProducts
    const products = await getAllProducts();

    // Vérifier que la réponse contient bien des produits
    expect(products).not.toBeNull();
    expect(products).not.toBeUndefined();
    expect(products.length).toBeGreaterThan(0);
  });
});
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

describe('Tests d\'intégration pour la fonction register', () => {
  // Définir un pool de test pour la base de données
  const testPool = new Pool({
    user: "postgres",
    host: "db",
    database: "mspr",
    password: "password",
    port: 5432,
    });

  // Après chaque test, fermer le pool de test
  afterAll(async () => {
    await testPool.end();
  });

  test('Test de la fonction register', async () => {
    // Appeler la fonction register avec la base de données de test
    const req = { query: { email: 'test@example.com', password: 'password', profile: 'revendeur' } };
    const res = {};

    await register(req, res, testPool);

    // Vérifier que l'utilisateur a été inséré dans la base de données
    const result = await testPool.query('SELECT * FROM users WHERE email = $1', [req.query.email]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].email).toEqual('test@example.com');
    expect(result.rows[0].api_key).toHaveLength(64);
  });
});
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

describe('Tests d\'intégration pour la fonction getUsers', () => {
    // Définir un pool de test pour la base de données
    const testPool = new Pool({
        user: "postgres",
        host: "db",
        database: "mspr",
        password: "password",
        port: 5432,
    });
  
    // Avant chaque test, ajouter un utilisateur à la base de données de test
    beforeEach(async () => {
      await testPool.query(`INSERT INTO users (email, password) VALUES ('test@example.com', 'password')`);
    });
  
    // Après chaque test, vider la table users de la base de données de test
    afterEach(async () => {
      await testPool.query(`DELETE FROM users`);
    });
  
    // Après chaque test, fermer le pool de test
    afterAll(async () => {
      await testPool.end();
    });
  
    test('Test de la fonction getUsers', async () => {
      // Appeler la fonction getUsers avec la base de données de test
      const req = {};
      const res = {};
  
      await getUsers(req, res, testPool);
  
      // Vérifier que l'utilisateur a été récupéré depuis la base de données
      const result = res.json.mock.calls[0][0];
      expect(result).toHaveLength(1);
      expect(result[0].email).toEqual('test@example.com');
      expect(result[0].password).toBeUndefined();
    });
});
