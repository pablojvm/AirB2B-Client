import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Image,
} from "react-bootstrap";
import PaymentIntent from "../components/PaymentIntent";
import service from "../services/service.config";

function formatCurrency(val, currency = "EUR") {
  const amount = Number(val);
  if (Number.isNaN(amount)) return `${val ?? ""} ${currency}`;
  return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(
    amount
  );
}

function PaymentPage() {
  const { bookingId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [showPaymentIntent, setShowPaymentIntent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      const response = await service.get(`/booking/${bookingId}`);
      const booking = response.data?.booking ?? response.data;
      console.log("Booking recibido:", booking);
      setProductDetails(booking);
    } catch (error) {
      console.error("Error al obtener los detalles de la reserva:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!productDetails) {
    return (
      <Container className="text-center mt-5">
        <h3>No se han encontrado los detalles de la reserva</h3>
      </Container>
    );
  }

  const accommodation = productDetails.accommodation;
  const startRaw = productDetails.start;
  const endRaw = productDetails.end;
  const totalPrice = productDetails.cost;
  const location = accommodation.city;
  const photoUrl = accommodation.photos?.[0];

  const formattedStart = startRaw
    ? new Date(startRaw).toLocaleDateString()
    : "—";
  const formattedEnd = endRaw ? new Date(endRaw).toLocaleDateString() : "—";

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h2 className="mb-4 text-center fw-bold">Finaliza tu reserva</h2>

          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
                  <Image
                    src={photoUrl}
                    alt={accommodation?.title || "Alojamiento"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold">
                    {accommodation?.title ??
                      productDetails?.title ??
                      "Alojamiento"}
                  </Card.Title>

                  <Card.Text className="text-muted mb-1">
                    <strong>Fechas:</strong> {formattedStart} - {formattedEnd}
                  </Card.Text>

                  <Card.Text className="mb-1">
                    <strong>Ubicación:</strong> {location}
                  </Card.Text>

                  <Card.Text className="mb-1">
                    <strong>Precio total:</strong> {formatCurrency(totalPrice)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-semibold mb-3 text-center">Método de pago</h5>

                {showPaymentIntent === false ? (
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="dark"
                      size="lg"
                      className="rounded-pill px-5"
                      onClick={() => setShowPaymentIntent(true)}
                    >
                      Proceder al pago
                    </Button>
                  </div>
                ) : (
                  <PaymentIntent
                    productDetails={{
                      price: totalPrice,
                      product: productDetails._id ?? bookingId,
                      buyer:
                        productDetails.buyer ??
                        productDetails.user ??
                        productDetails.userId,
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
