const Order = require("../models/Order")
const Product = require("../models/product.model")
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); 

//create Order
exports.createOrder = async (req, res) =>{
    
    try {

        const userId = req.user.id;
        
        
        
        const {
            products,
            shippingAddress,
            totalAmount,
            paymentID,
            date,
            time
        } = req.body;
       
        if(!userId || !products || !shippingAddress || !totalAmount || !paymentID) {
            return res.status(400).json({error: "All fields are required"});
        }

        const user = await User.findById(userId);

        // Check stock and reduce
        for (const item of products) {
            const product = await Product.findById(item.productId || item._id);
            
            if (!product) return res.status(404).json({ error: `Product not found: ${item.title}` });
            if (product.stock < (item.quantity || 1)) {
                return res.status(400).json({ error: `Insufficient stock for: ${product.title}` });
            }
        }

        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.productId || item._id,
                { $inc: { stock: -(item.quantity || 1) } }
            );
        }

        const order = new Order({
            userId,
            products,
            shippingAddress,
            totalAmount,
            paymentID,
            date,
            time
        });

        const productList = products.map((item) => (
            `${item.title} - Quantity: ${item.quantity || 1}`
        ))

        await order.save();

        // Send email notification
        try{
            await sendEmail(
                user.email,
                "Order Placed Successfully",
                `Hello ${user.username},\n\n
            
                Your order has been placed successfully.\n\n
                Order Details: ${productList.join("\n")}\n\n
                Total Amount: $${totalAmount}\n\n
                Thank you for shopping with us!`
            );
        } catch (error) {
        console.error("Error sending email:", error);
    }


        res.json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

//Get all Order
exports.getOrders = async(req,res) => {
    try {
        const orders = await Order.find();
        res.json({
            success: true,
            orders
        });
    } catch(err) {
        res.status(500).json({error: err.message});

    }
}

exports.getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({
            userId:req.params.userId
        });
        res.json({
            success: true,
            orders
        })
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}