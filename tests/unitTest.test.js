import sinon from 'sinon';
import expect from 'chai'
import getUsers from '../src/controllers/users.controller.js'
import pool from '../src/database.js'


describe('getUsers', () => {
  let poolQueryStub;
  let res;

  before(() => {
    poolQueryStub = sinon.stub(pool, 'query');
  });

  after(() => {
    poolQueryStub.restore();
  });

  beforeEach(() => {
    res = {
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    poolQueryStub.reset();
    res.json.resetHistory();
  });

  it('should return the list of users', async () => {
    // Arrange
    const mockUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ];

    poolQueryStub.resolves({ rows: mockUsers });

    // Act
    await getUsers(null, res);

    // Assert
    sinon.assert.calledWith(poolQueryStub, 'SELECT * FROM users');
    sinon.assert.calledWith(res.json, mockUsers);
  });

 
});


describe('GET /customers/:customerId/:apiKey', () => {
  let poolQueryStub;

  before(() => {
    poolQueryStub = sinon.stub();
    const pool = {
      query: poolQueryStub,
      connect: sinon.stub().resolves(),
    };
    Object.defineProperty(require('../src/database'), 'pool', { value: pool });
  });

  beforeEach(() => {
    poolQueryStub.reset();
  });

  after(async () => {
    await pool.query('DELETE FROM users');
  });

  it('should return the list of orders for a customer when a valid apiKey is provided', async () => {
    // Arrange
    const mockOrders = [
      { id: 1, customerId: 1, totalAmount: 50.99 },
      { id: 2, customerId: 1, totalAmount: 100.25 },
      { id: 3, customerId: 1, totalAmount: 75.50 },
    ];

    poolQueryStub
      .withArgs(`SELECT api_key FROM users WHERE api_key = 'validApiKey' UNION SELECT key FROM webshopkey WHERE key = 'validApiKey'`)
      .resolves({ rowCount: 1 });

    sinon.stub(getCustomerOrders, 'resolves').returns(mockOrders);

    // Act
    const response = await request(app).get('/customers/1/validApiKey');

    // Assert
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, mockOrders);
  });

  it('should return a 401 error when an invalid apiKey is provided', async () => {
    // Arrange
    poolQueryStub
      .withArgs(`SELECT api_key FROM users WHERE api_key = 'invalidApiKey' UNION SELECT key FROM webshopkey WHERE key = 'invalidApiKey'`)
      .resolves({ rowCount: 0 });

    // Act
    const response = await request(app).get('/customers/1/invalidApiKey');

    // Assert
    assert.strictEqual(response.status, 401);
    assert.deepStrictEqual(response.body, { message: 'Accès refusé. Clé API invalide.' });
  });

});


