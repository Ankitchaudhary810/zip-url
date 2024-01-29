const express = require('express');
const router = express.Router();

const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { createShortUrl, redirectUrl, verifyPassword, getShortUrl, DeleteShortUrl, getUrlbyShortUrl, getshortUrlById, handleUpdateUrl, BulkUpload } = require("../controllers/url");

const multer = require('multer');


const upload = multer({ dest: 'uploads/' });

router.param("userId", getUserById);
router.param("shortUrl", getShortUrl);
// router.param("shortUrl", );

router.post("/url/create/:userId", isSignedIn, isAuthenticated, createShortUrl);
router.post('/url/bulk-upload/:userId', upload.single('file'), isSignedIn, isAuthenticated, BulkUpload);
router.get("/get/:id/:userId", isSignedIn, isAuthenticated, getshortUrlById);
router.get("/url/:shortUrl", getUrlbyShortUrl)
router.get("/:shortUrl", redirectUrl);
router.post('/verify/url/:shortUrl', verifyPassword);
router.delete('/delete/url', DeleteShortUrl);

router.put("/url-update/:id/:userId", isSignedIn, isAuthenticated, handleUpdateUrl);

module.exports = router;