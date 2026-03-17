const Product = require("../models/product.model");


//Add Product
exports.createProduct = async (req, res) => {
    try{
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//Update Product
exports.updateProduct = async (req, res) => {
    try{
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({
                success: true,
                product
            });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//delete product 
exports.deleteProduct = async (req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            product
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//Get Products
exports.getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.getProductsById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            success: true,
            product
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//Get Products by Category
exports.getCategoryProduct = async (req, res) => {
    try{
        const { category } = req.params;
        const products = await Product.find({ category });
        res.status(200).json({
            success: true,
            products
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//add Product in card
exports.addProductToCard = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}