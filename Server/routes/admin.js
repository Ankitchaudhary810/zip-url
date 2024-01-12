const express = require('express');
const router = express.Router();

const { adminSignup, adminSignin, adminSignout, getAdminById, isAdminSignedIn, isAdminAuthenticated, getUsers, getUserUrl, deleteUrlAccount, handleUserSideReports, handleAdminSideReports, handleDeleteUrlAdminSide } = require("../controllers/admin")

//for admin Authentication
router.post("/signup", adminSignup);
router.post("/signin", adminSignin);
router.get("/signout", adminSignout);

// for admin Routes to access the user and url data.
router.param('adminId', getAdminById);
router.get('/users/:adminId', isAdminSignedIn, isAdminAuthenticated, getUsers);
router.get("/users/url/:userId/:adminId", isAdminSignedIn, isAdminAuthenticated, getUserUrl);

// for admin routes to delete the user and url data.
router.delete("/user/account/delete/:userId/:adminId", isAdminSignedIn, isAdminAuthenticated, deleteUrlAccount);

router.delete("/user/delete/url/:urlId/:userId", handleDeleteUrlAdminSide)

// for Admin Reports
router.get("/user-side/reports/:adminId", isAdminSignedIn, isAdminAuthenticated, handleUserSideReports);



// admin reporst for the user
router.get("/admin-reports", handleAdminSideReports)


module.exports = router;