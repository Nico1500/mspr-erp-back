import { pool } from "../database.js";

pool.connect;

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return res.json(result.rows);
  } catch (error) {
    console.log(
      "🚀 ~ file: users.controller.js ~ line 9 ~ getUsers ~ error",
      error
    );
  }
};

export const test = async (req, res) => {
    try {
      return res.json("cc");
    } catch (error) {
      console.log(
        "🚀 ~ file: test ",
        error
      );
    }
  };