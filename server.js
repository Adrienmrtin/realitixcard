const stripe = require('stripe')('sk_test_51IpDGtEBgVtytQOeqBunbdCCwn2z7lZ10pq8dOAlRxiuvfup1bhynxZ8YRFndvehZ2uBgWj9Fo65tkFUVG5emty700tELoALFJ');
const express = require('express');
const app = express();
app.use(express.static('.'));

const YOUR_DOMAIN = 'http://localhost:3000/checkout';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Bonne année !',
            images: ['https://ik.imagekit.io/jgzbxs7vz/1_YZ6IIb3i3HP.png'],
          },
          unit_amount: 990,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Running on port 4242'));