import { getUsers } from "../src/controllers/users.controller.js";
import { pool } from "../src/database.js";
import { afterAll } from 'jest';



describe("getUsers", () => {
  afterAll(async () => {
    await pool.end();
  });

  test("should return all users from the database", async () => {
    // Arrange
    const req = {};
    const res = { json: jest.fn() };

    // Act
    await getUsers(req, res);

    // Assert
    expect(res.json).toHaveBeenCalled();
  });

  test("should log an error if the database query fails", async () => {
    // Arrange
    const req = {};
    const res = { json: jest.fn() };
    const expectedError = new Error("Test error");

    // Mock the pool.query function to throw an error
    pool.query.mockImplementationOnce(() => {
      throw expectedError;
    });

    console.error = jest.fn();

    // Act
    await getUsers(req, res);

    // Assert
    expect(console.error).toHaveBeenCalledWith(expectedError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
