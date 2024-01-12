const express = require('express');
const router = express.Router();

const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { createShortUrl, redirectUrl, verifyPassword, getShortUrl, DeleteShortUrl, getUrlbyShortUrl, getshortUrlById } = require("../controllers/url")

router.param("userId", getUserById);
router.param("shortUrl", getShortUrl);
// router.param("shortUrl", );

router.post("/url/create/:userId", isSignedIn, isAuthenticated, createShortUrl);
router.get("/get/:id/:userId", isSignedIn, isAuthenticated, getshortUrlById);
router.get("/url/:shortUrl", getUrlbyShortUrl)
router.get("/:shortUrl", redirectUrl);
router.post('/verify/url/:shortUrl', verifyPassword);
router.delete('/delete/url', DeleteShortUrl);

module.exports = router;