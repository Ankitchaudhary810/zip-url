const express = require('express');
const router = express.Router();


const { getUserById, getUser, verifyUser, getUrlsById, updateUserName, updateUserPassword } = require("../controllers/user");

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param('userId', getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/:id/verify/:token/", verifyUser);
router.put("/user/update/username/:userId", isSignedIn, isAuthenticated, updateUserName);
router.put("/user/update/password/:userId", isSignedIn, isAuthenticated, updateUserPassword);

//Test Route 
router.get("/urls/:userId", getUrlsById);


module.exports = router;