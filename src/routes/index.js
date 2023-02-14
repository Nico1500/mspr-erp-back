const { getarticle, getUsers } = require('../controllers/article');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/article', getarticle);
router.get('/users', getUsers);


module.exports = router;
