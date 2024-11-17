const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

const app = express();
app.use(express.json());

// Set allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5500",
  "https://hair-saloon-user-frontend.vercel.app/",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());

// Basic test route
app.get("/", (req, res) => {
  res.send("Hello from server");
});

// Stripe payment route
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body; // Retrieve amount and currency from the request body

    // Create a payment intent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount should be in the smallest unit of the currency (e.g., cents for USD)
      currency: currency,
      payment_method_types: ["card"], // Specify allowed payment methods
    });

    // Return the client secret for the payment intent to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add your user routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const port = 8000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
