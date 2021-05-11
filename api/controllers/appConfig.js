const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    title: 'Gamedia',
    description: 'A place were gamers find games and players',
  });
});


module.exports = router;