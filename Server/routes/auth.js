const express = require('express');
const router = express.Router();

const { signup, isAuthenticated, isSignedIn, signin, signout } = require('../controllers/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);


//Test Route



module.exports = router;