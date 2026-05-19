import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import PaymentIntent from "../components/PaymentIntent";
import service from "../services/service.config";

function formatCurrency(val, currency = "EUR") {
  const amount = Number(val);
  if (Number.isNaN(amount)) return `${val ?? ""} ${currency}`;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);
}

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [showPaymentIntent, setShowPaymentIntent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await service.get(`/booking/${bookingId}`);
        const booking = response.data?.booking ?? response.data;
        if (!cancelled) setProductDetails(booking);
      } catch (err) {
        console.error("Error al obtener los detalles de la reserva:", err);
        if (!cancelled)
          setError(
            err.response?.data?.message ||
              "No se pudieron cargar los detalles de la reserva."
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !productDetails) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          {error || "No se han encontrado los detalles de la reserva"}
        </Alert>
        <Button variant="outline-dark" onClick={() => navigate("/myBookings")}>
          Ir a mis reservas
        </Button>
      </Container>
    );
  }

  const accommodation = productDetails.accommodation || {};
  const totalPrice = productDetails.cost;
  const photoUrl = accommodation.photos?.[0] || "/imagenpre.webp";

  const formattedStart = productDetails.start
    ? new Date(productDetails.start).toLocaleDateString("es-ES")
    : "—";
  const formattedEnd = productDetails.end
    ? new Date(productDetails.end).toLocaleDateString("es-ES")
    : "—";

  const alreadyPaid =
    productDetails.status === "accepted" ||
    productDetails.status === "confirmed";

  return (
    <Container className="py-4 payment-page">
      <Row className="justify-content-center">
        <Col md={11} lg={10}>
          <h1 className="page-title mb-4 text-center">Finaliza tu reserva</h1>

          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="payment-page__media">
                  <img
                    src={photoUrl}
                    alt={accommodation?.title || "Alojamiento"}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold">
                    {accommodation?.title ?? "Alojamiento"}
                  </Card.Title>
                  {accommodation?.city && (
                    <Card.Text className="text-muted mb-2">
                      {accommodation.city}
                    </Card.Text>
                  )}
                  <hr />
                  <Card.Text className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Entrada</span>
                    <strong>{formattedStart}</strong>
                  </Card.Text>
                  <Card.Text className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Salida</span>
                    <strong>{formattedEnd}</strong>
                  </Card.Text>
                  <Card.Text className="d-flex justify-content-between mb-0">
                    <span className="text-muted">Huéspedes</span>
                    <strong>{productDetails.guests ?? "—"}</strong>
                  </Card.Text>
                  <hr />
                  <Card.Text className="d-flex justify-content-between fw-bold fs-5 mb-0">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-semibold mb-3 text-center">Pago</h5>

                {alreadyPaid ? (
                  <Alert variant="success" className="mb-0 text-center">
                    Esta reserva ya está pagada. ¡Disfruta del viaje!
                  </Alert>
                ) : !showPaymentIntent ? (
                  <div className="d-grid">
                    <Button
                      className="airb2b-btn-primary"
                      onClick={() => setShowPaymentIntent(true)}
                    >
                      Proceder al pago seguro
                    </Button>
                    <small className="text-muted text-center mt-2">
                      Pago seguro procesado por Stripe.
                    </small>
                  </div>
                ) : (
                  <PaymentIntent
                    productDetails={{
                      product: productDetails._id ?? bookingId,
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentPage;
