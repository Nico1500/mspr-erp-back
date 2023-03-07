import { getUsers } from "../src/controllers/users.controller.js";
import { pool } from "../src/database.js";

function add(a, b) {
  return a + b;
}

describe('add', () => {
  test('should return the sum of two numbers', () => {
    const result = add(2, 3);
    const expected = 5;

    if (result === expected) {
      console.log('Test passed');
    } else {
      console.error(`Test failed: expected ${expected}, but got ${result}`);
    }
  });
});
