const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

require('dotenv').config();

const app = express()

const stripe = new Stripe(process.env.SECRET_KEY);

app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())

app.post('/api/checkout', async (req, res) => {

    const { id, amount } = req.body

try {
    const payment = await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Gaming Headset",
        payment_method: id,
        confirm: true
    });

    console.log(payment);

    return res.status(200).json({ message: "Successful Payment" });
} catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
}
});

app.listen(3001, () => {
    console.log('Server on port', 3001)
});

