const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    title: 'Gamedia',
    description: 'Backend API of social media site for gamers',
  });
});


module.exports = router;