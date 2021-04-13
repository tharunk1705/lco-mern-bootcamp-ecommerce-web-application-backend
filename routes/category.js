const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const { getUserById} = require("../controllers/user");
const { getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, removeCategory} = require("../controllers/category");

// Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// Routes

// Create Route
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);

// Read Route
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

// Update Route
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

// Delete Route
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory);


module.exports = router;