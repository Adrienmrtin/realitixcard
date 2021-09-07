import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./App.css";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51IpDGtEBgVtytQOeb5T21wILuNfmv84DUkjeb76x5AkdxjkflM2j07LZtBmx2g2NN2klx7c12rxcQ4lXU3DArKPe00pMhJl2uO");

const ProductDisplay = ({ handleClick }) => (
  <section>
    <div className="product">
      {/*<img
        src="https://ik.imagekit.io/jgzbxs7vz/1_YZ6IIb3i3HP.png"
        alt="The cover of Stubborn Attachments"
      />*/}
      <div className="description">
        <h3>Bonne année !</h3>
        <h5>9,90€</h5>
      </div>
    </div>
    <button type="button" id="checkout-button" role="link" onClick={handleClick}>
      Checkout
    </button>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Merci pour votre commande");
    }

    if (query.get("canceled")) {
      setMessage(
        "Commande annulée"
      );
    }
  }, []);

  const handleClick = async (event) => {
    const stripe = await stripePromise;

    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });

    const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  return message ? (
    <Message message={message} />
  ) : (
      <ProductDisplay handleClick={handleClick} />
    );
}
