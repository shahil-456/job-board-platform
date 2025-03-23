import e from "express";
import { mentorAuth } from "../middlewares/mentorAuth.js";
import Stripe from "stripe";


import dotenv from 'dotenv';
dotenv.config();

// import { Order } from "../models/orderModel.js";
const router = e.Router();



const stripe = new Stripe('sk_test_51R5MNEQYp10icJweC92NjYKq89pQiVaVcQELOEkfSyUn7tL0Hn6TClJ2kNzgZiDYWwHtN6Q8NEsrC1XUPzGbSWxp00eWoxVwyO');
const client_domain = process.env.CLIENT_DOMAIN;

router.post("/create-checkout-session", mentorAuth, async (req, res, next) => {
    try {

        const mentorId = req.mentor.id; 
        const { products } = req.body;

        const lineItems = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Premium Token",
                        description: "Buy a token for premium access",
                    },
                    unit_amount: 10000, // Amount in cents (1000 = $10)
                },
                quantity: 1, // Number of items being purchased
            },
        ];
        

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${client_domain}employer/payment/success`,
            cancel_url: `${client_domain}employer/payment/cancel`,
        });

        // const newOrder = new Order({ userId, sessionId: session?.id });
        // await newOrder.save()

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
});

router.get("/session-status", async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log("session=====", session);

        res.send({
            status: session?.status,
            customer_email: session?.customer_details?.email,
            session_data: session,
        });
    } catch (error) {
        res.status(error?.statusCode || 500).json(error.message || "internal server error");
    }
});

export { router as paymentRouter };