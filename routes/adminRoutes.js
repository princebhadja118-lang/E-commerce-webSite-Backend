const express = require("express");
const routes = express.Router();
const {adminAddUser, adminUpdateUser ,getAllUsers ,deleteUser,createProduct, 
    getAdminProducts,updateProduct,deleteProduct, getOrders} =
 require("../controllers/adminController")
const authMiddleware = require("../middleware/authMiddleware")

//Users
routes.post("/users", adminAddUser);
routes.put("/users/:id", authMiddleware, adminUpdateUser);
routes.get("/get-users", getAllUsers);
routes.delete("/users-delete/:id", authMiddleware, deleteUser);

//Products
routes.post("/products", authMiddleware, createProduct);
routes.get("/products", getAdminProducts);
// support old + RESTful routes for product updates/deletes
routes.put("/update-products/:id", authMiddleware, updateProduct);
routes.delete("/delete-products/:id", authMiddleware, deleteProduct);

//Orders
routes.get("/orders", getOrders);

module.exports = routes;