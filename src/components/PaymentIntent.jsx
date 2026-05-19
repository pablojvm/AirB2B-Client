import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Spinner, Alert } from "react-bootstrap";
import service from "../services/service.config";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentIntent({ productDetails }) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await service.post(
          "/payment/create-payment-intent",
          productDetails
        );
        if (!cancelled) setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Error creando payment intent:", err);
        if (!cancelled)
          setError(
            err?.response?.data?.message ||
              "No se pudo iniciar el pago. Inténtalo de nuevo."
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productDetails]);

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!clientSecret) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="text-muted mt-2 mb-0">Preparando el pago seguro…</p>
      </div>
    );
  }

  return (
    <Elements
      options={{ clientSecret, appearance: { theme: "stripe" } }}
      stripe={stripePromise}
    >
      <CheckoutForm />
    </Elements>
  );
}

export default PaymentIntent;
