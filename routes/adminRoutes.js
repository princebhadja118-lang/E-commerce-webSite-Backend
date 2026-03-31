const express = require("express");
const routes = express.Router();
const {adminAddUser, adminUpdateUser ,getAllUsers ,deleteUser,createProduct, 
    getAdminProducts,updateProduct,deleteProduct, getOrders} =
 require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware")
const isAdmin = require("../middleware/IsAdmin");


//Users
routes.post("/users", adminAddUser);
routes.put("/users/:id", authMiddleware, isAdmin, adminUpdateUser);
routes.get("/get-users", getAllUsers);
routes.delete("/users-delete/:id", authMiddleware, isAdmin, deleteUser);

//Products
routes.post("/products", authMiddleware, isAdmin, createProduct);
routes.get("/products", getAdminProducts);
routes.put("/update-products/:id", authMiddleware, isAdmin, updateProduct);
routes.delete("/delete-products/:id", authMiddleware, isAdmin, deleteProduct);

//Orders
routes.get("/orders", getOrders);

module.exports = routes;