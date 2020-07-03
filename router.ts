import express = require('express');
const router: express.Router = express.Router();

router.get('/', (req, res) => {
    res.send('Chat server is running');
});

module.exports = router;