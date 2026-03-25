const Order = require("../models/Order")
const Product = require("../models/product.model")
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); 

//create Order
exports.createOrder = async (req, res) =>{
    
    try{

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

        const productRows = products.map((item) => 
         `<tr>
            <td><img src="${item.img}" alt="${item.title}" width="60" style="border-radius:4px"/></td>
            <td style="padding:8px">${item.title}</td>
            <td style="padding:8px">${item.quantity || 1}</td>
            <td style="padding:8px">₹${item.price || 0}</td>
        </tr>`).join('');

        const html = `
            <h2>Order Placed Successfully</h2>
            <p>Hello ${shippingAddress.name},</p>
            <table border="1" cellpadding="6" cellspacing="0" style="width:100%; border-collapse:collapse">
                <thead><tr><th>Image</th><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>${productRows}</tbody>
            </table>
            <p><strong>Total: ₹${totalAmount}</strong></p>
            <p>Thank you for shopping with us!</p>`;

        await order.save();

        // Send email notification
        try{
            await sendEmail(
                shippingAddress.email,
                "Order Placed Successfully",
                `Order ${order._id} placed. Total: ₹${totalAmount}`,
                html
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
        console.log("Error creating order:", err);
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