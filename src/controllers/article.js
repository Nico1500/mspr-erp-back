const { pool } = require('../configBdd');


const getarticle = async (req, res) => {
    console.log(pool);
    res.json("cc");
  };
  
const getUsers= async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM users`);
      console.log(result)
      //return res.json(result.rows);
      return res.json("coucou");
    } catch (error) {
      console.log(
        "GetUsers in file ** error",
        error
      );
    }
  };

module.exports = { getarticle, getUsers };
  