const express = require("express");
const router = express.Router();

const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");


router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
// updating the user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
// purchaselist using populate
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);



// router.get("/users",getAllUsers) Assignment
module.exports = router;