import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import service from "../services/service.config";

const formatCurrency = (amount, currency = "EUR") => {
  try {
    // Aseguramos que amount sea número (si no, 0)
    const n = typeof amount === "number" && !Number.isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
    }).format(n);
  } catch {
    return `${amount ?? 0} ${currency}`;
  }
};

const SmallDetail = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
    <small style={{ color: "#666" }}>{label}</small>
    <small style={{ fontWeight: 600 }}>{value}</small>
  </div>
);

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isFetching, setIsFetching] = useState(true);
  const [payment, setPayment] = useState(null);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleUseEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseEffect = async () => {
    const clientSecret = new URLSearchParams(location.search).get("payment_intent_client_secret");
    const paymentIntentId = new URLSearchParams(location.search).get("payment_intent");

    if (!paymentIntentId) {
      setError("No se encontró el identificador del pago.");
      setIsFetching(false);
      return;
    }

    const paymentIntentInfo = { clientSecret, paymentIntentId };

    try {
      const res = await service.patch("/payment/update-payment-intent", paymentIntentInfo);
      const data = res.data || {};
      // El backend que te devolvía { payment, booking } según tu implementación previa
      setPayment(data.payment ?? null);
      setBooking(data.booking ?? data.payment?.product ?? null);
      setIsFetching(false);
      console.log("PATCH update-payment-intent ->", data);
    } catch (err) {
      console.error("Error actualizando payment:", err);
      // Fallback: try GET by intent
      try {
        const res2 = await service.get(`/payment/by-intent/${paymentIntentId}`);
        const payload = res2.data ?? {};
        // Acomodamos varias formas de respuesta que pueda devolver tu backend
        const possibleBooking = payload.booking ?? payload.payment?.product ?? payload?.payment?.product ?? null;
        setPayment(payload.payment ?? payload ?? null);
        setBooking(possibleBooking);
        setIsFetching(false);
        console.log("GET by-intent ->", payload);
      } catch (err2) {
        console.error("Fallback failed:", err2);
        setError(
          "Hubo un problema actualizando el pago. Si el cargo se realizó, aparecerá en tus reservas. Intenta recargar la página o contacta soporte."
        );
        setIsFetching(false);
      }
    }
  };

  if (isFetching) {
    return (
      <Container className="py-5" style={{ minHeight: 400 }}>
        <div className="d-flex justify-content-center align-items-center" style={{ gap: 12 }}>
          <Spinner animation="border" />
          <div>Actualizando pago…</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5" style={{ minHeight: 400 }}>
        <Row>
          <Col>
            <Card style={{ border: "none" }}>
              <Card.Body>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "#f4b400",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 36,
                      boxShadow: "0 6px 18px rgba(244,180,0,0.15)",
                    }}
                    aria-hidden
                  >
                    !
                  </div>
                  <div>
                    <h2 style={{ margin: 0 }}>Problema actualizando el pago</h2>
                    <div style={{ color: "#666" }}>Gracias por reservar con AirB2B</div>
                  </div>
                </div>

                <hr style={{ margin: "20px 0" }} />

                <div className="alert alert-warning">{error}</div>

                <div className="mt-3 d-flex gap-2">
                  <Button variant="outline-secondary" onClick={() => navigate("/myBookings")}>
                    Ver mis reservas
                  </Button>
                  <Button variant="primary" onClick={() => navigate("/")}>
                    Volver al inicio
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="py-5" style={{ minHeight: 400 }}>
        <Row>
          <Col>
            <Card style={{ border: "none" }}>
              <Card.Body>
                <h2>Reserva procesada</h2>
                <p style={{ color: "#666" }}>
                  La transacción pudo haberse completado, pero no se ha encontrado la reserva en la respuesta. Revisa{" "}
                  <Link to="/myBookings">Mis reservas</Link> o contacta con soporte si no la ves.
                </p>
                <div className="mt-3 d-flex gap-2">
                  <Button variant="outline-secondary" onClick={() => navigate("/myBookings")}>
                    Ver mis reservas
                  </Button>
                  <Button variant="primary" onClick={() => navigate("/")}>
                    Volver al inicio
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const accommodation = booking?.accommodation ?? {};
  const photos = Array.isArray(accommodation?.photos) ? accommodation.photos : [];
  const firstPhoto = photos.length > 0 ? photos[0] : null;
  const fallbackTitle = accommodation?.title ?? accommodation?.name ?? "Reserva confirmada";
  const fallbackHost = accommodation?.owner?.username ?? payment?.product?.owner?.username ?? "Anfitrión";
  const price = typeof booking?.cost === "number" ? booking.cost : Number(booking?.cost) || 0;
  const currency = "EUR";

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card style={{ border: "none" }}>
            <Card.Body>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "#0f9d58",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 36,
                    boxShadow: "0 6px 18px rgba(15,157,88,0.15)",
                  }}
                  aria-hidden
                >
                  ✓
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{fallbackTitle}</h2>
                  <div style={{ color: "#666" }}>Gracias por reservar con AirB2B</div>
                </div>
              </div>

              <hr style={{ margin: "20px 0" }} />

              <h5>Detalles de la reserva</h5>
              <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "flex-start" }}>
                <div style={{ width: 140, height: 100, borderRadius: 12, overflow: "hidden", background: "#f3f3f3" }}>
                  {firstPhoto ? (
                    <img src={firstPhoto} alt="foto alojamiento" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
                      Sin foto
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ color: "#666", marginBottom: 6 }}>{fallbackHost}</div>
                  <h6 style={{ margin: 0 }}>{fallbackTitle}</h6>
                  <div style={{ marginTop: 8 }}>
                    <small style={{ color: "#666" }}>{accommodation?.city ?? "—"}</small>
                  </div>
                </div>
              </div>

              <hr />

              <h6>Información</h6>
              <div style={{ marginTop: 8 }}>
                <SmallDetail label="Pago" value={formatCurrency(price, currency)} />
                <SmallDetail label="Estado del pago" value={payment?.status ?? "unknown"} />
                <SmallDetail label="ID pago (Stripe)" value={payment?.paymentIntentId ?? "—"} />
                <SmallDetail label="ID interno" value={payment?._id ?? "—"} />
              </div>

              <hr />

              <h6>Qué esperar ahora</h6>
              <p style={{ color: "#666" }}>
                Has recibido un correo con la confirmación. La reserva aparecerá en <Link to="/myBookings">Mis reservas</Link>. Si necesitas factura o comprobante, contacta con el anfitrión.
              </p>
            </Card.Body>
          </Card>

          <div className="mt-3 d-flex gap-2">
            <Button variant="outline-secondary" onClick={() => navigate("/myBookings")}>
              Ver mis reservas
            </Button>
            <Button variant="primary" onClick={() => navigate("/")}>
              Volver al inicio
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <div style={{ position: "sticky", top: 20 }}>
            <Card>
              <Card.Body>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, color: "#666" }}>Total</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(price, currency)}</div>
                  </div>
                  <Badge bg="light" text="dark" style={{ borderRadius: 8 }}>
                    {payment?.status === "succeeded" ? "Pagado" : "Pendiente"}
                  </Badge>
                </div>

                <hr />

                <div>
                  <SmallDetail label="Precio" value={formatCurrency(price, currency)} />
                  <SmallDetail label="Total" value={formatCurrency(price, currency)} />
                </div>

                <hr />

                <div className="d-grid">
                  <Button variant="outline-primary" as={Link} to={`/receipt/${payment?._id ?? ""}`}>
                    Ver comprobante
                  </Button>
                  <Button variant="success" className="mt-2" onClick={() => navigate("/contact-host")}>
                    Contactar con el anfitrión
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="mt-3">
              <Card.Body>
                <small style={{ color: "#666" }}>¿Necesitas ayuda?</small>
                <div style={{ marginTop: 8 }}>
                  <Button variant="link" onClick={() => navigate("/help")}>Centro de ayuda</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
