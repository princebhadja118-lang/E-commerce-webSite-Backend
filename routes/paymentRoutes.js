const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  

router.post("/method", async (req, res) => {
  try {

    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (e) {

    console.log(e);

    switch (e.type) {

      case "StripeCardError":
        console.log(`Payment error: ${e.message}`);
        break;

      case "StripeInvalidRequestError":
        console.log("Invalid Stripe request");
        break;

      default:
        console.log("Stripe error:", e.message);
        break;
    }

    res.status(500).json({
      success: false,
      message: "Payment Failed",
    });
  }
});

module.exports = router;