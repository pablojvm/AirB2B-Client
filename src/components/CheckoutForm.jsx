import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Spinner, Alert } from "react-bootstrap";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Pago completado. ¡Gracias!");
          setVariant("success");
          break;
        case "processing":
          setMessage("Tu pago se está procesando.");
          setVariant("info");
          break;
        case "requires_payment_method":
          setMessage("El pago no se completó. Intenta otro método.");
          setVariant("warning");
          break;
        default:
          setMessage("Algo salió mal con el pago.");
          setVariant("danger");
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // confirmPayment redirige al return_url cuando va bien; si vuelve aquí, hay error.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Error con la tarjeta");
      } else {
        setMessage("Ocurrió un error inesperado.");
      }
      setVariant("danger");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="airb2b-btn-primary w-100 mt-3"
      >
        {isLoading ? <Spinner animation="border" size="sm" /> : "Pagar ahora"}
      </Button>
      {message && (
        <Alert variant={variant} className="mt-3 mb-0">
          {message}
        </Alert>
      )}
    </form>
  );
}

export default CheckoutForm;
