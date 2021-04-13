const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const { updateStock} = require("../controllers/product");
const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus} = require("../controllers/order");

// params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// Actual routes
// create order
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);
// get all orders
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);
// get order status
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
// update order status
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;