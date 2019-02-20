const express = require('express');
const router = express.Router();
const User = require('../models/user');
const validationRegex = require('../utils/validation');

router.post('/', (req, res) => {
    let q = req.body;
    var user = new User();

    if (!q.username.match(validationRegex.username)) {
        res.json({ type: 'error', message: 'Invalid username' });
    } else {
        user.username = q.username;
        user.password = q.password;
        user.email = q.email;

        user.save(err => {
            if (err) return res.send(err);

            res.json({ message: 'Bruger tilføjet', id: user._id });
        });
    }
});

// TODO: Sletning af bruger (Under EU lovgivning)

// TODO: Hente al information vi har på brugeren (under EU lovgivning)

module.exports = router;
