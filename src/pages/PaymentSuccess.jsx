import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Alert,
} from "react-bootstrap";
import service from "../services/service.config";

const formatCurrency = (val) => {
  const n = Number(val);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(n);
};

const Detail = ({ label, value }) => (
  <div className="d-flex justify-content-between mb-1">
    <span className="text-muted small">{label}</span>
    <span className="fw-semibold small">{value}</span>
  </div>
);

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isFetching, setIsFetching] = useState(true);
  const [payment, setPayment] = useState(null);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentIntentId = params.get("payment_intent");

    if (!paymentIntentId) {
      setError("No se encontró el identificador del pago.");
      setIsFetching(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await service.patch("/payment/update-payment-intent", {
          paymentIntentId,
        });
        if (cancelled) return;
        setPayment(res.data?.payment || null);
        setBooking(res.data?.booking || null);
      } catch (err) {
        console.error("Error actualizando payment:", err);
        try {
          const fallback = await service.get(
            `/payment/by-intent/${paymentIntentId}`
          );
          if (cancelled) return;
          setPayment(fallback.data || null);
        } catch (err2) {
          console.error("Fallback fallido:", err2);
          if (!cancelled)
            setError(
              "Hubo un problema actualizando el pago. Si el cargo se realizó, aparecerá en tus reservas."
            );
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.search]);

  if (isFetching) {
    return (
      <Container className="py-5" style={{ minHeight: 360 }}>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <Spinner animation="border" />
          <span>Actualizando pago…</span>
        </div>
      </Container>
    );
  }

  const accommodation = booking?.accommodation || null;
  const owner = accommodation?.owner || null;
  const price = booking?.cost ?? null;

  const isSucceeded = payment?.status === "succeeded";
  const isProcessing = payment?.status === "processing";
  const isFailed = payment?.status === "failed" || payment?.status === "incomplete";

  // Estado visual de la cabecera
  const headerVisual = isSucceeded
    ? {
        cls: "payment-success__check payment-success__check--success",
        icon: "✓",
        title: "¡Reserva confirmada!",
        subtitle: "Gracias por reservar con AirB2B",
      }
    : isProcessing
    ? {
        cls: "payment-success__check payment-success__check--info",
        icon: "…",
        title: "Procesando tu pago",
        subtitle: "Te avisaremos en cuanto se confirme",
      }
    : isFailed
    ? {
        cls: "payment-success__check payment-success__check--warn",
        icon: "!",
        title: "Pago no completado",
        subtitle: "Inténtalo de nuevo o cambia de método",
      }
    : {
        cls: "payment-success__check payment-success__check--info",
        icon: "i",
        title: "Estado desconocido",
        subtitle: "Consulta el estado en tus reservas",
      };

  return (
    <Container className="py-4 payment-success">
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className={headerVisual.cls}>{headerVisual.icon}</div>
                <div>
                  <h2 className="mb-0">{headerVisual.title}</h2>
                  <div className="text-muted">{headerVisual.subtitle}</div>
                </div>
              </div>

              {error && <Alert variant="warning">{error}</Alert>}

              {booking && (
                <>
                  <h5 className="mb-3">Detalles de la reserva</h5>
                  <div className="d-flex gap-3 mb-3 align-items-start flex-wrap">
                    {accommodation?.photos?.[0] && (
                      <img
                        src={accommodation.photos[0]}
                        alt="Alojamiento"
                        className="payment-success__photo"
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h6 className="mb-1">
                        {accommodation?.title || "Alojamiento"}
                      </h6>
                      {accommodation?.city && (
                        <div className="text-muted small mb-1">
                          {accommodation.city}
                        </div>
                      )}
                      {owner?.username && (
                        <div className="small">
                          Anfitrión: {owner.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <hr />
                  <Detail
                    label="Entrada"
                    value={
                      booking.start
                        ? new Date(booking.start).toLocaleDateString("es-ES")
                        : "—"
                    }
                  />
                  <Detail
                    label="Salida"
                    value={
                      booking.end
                        ? new Date(booking.end).toLocaleDateString("es-ES")
                        : "—"
                    }
                  />
                  <Detail label="Huéspedes" value={booking.guests ?? "—"} />
                  <Detail label="Importe" value={formatCurrency(price)} />
                  <Detail
                    label="Estado del pago"
                    value={payment?.status ?? "—"}
                  />
                  <Detail
                    label="ID Stripe"
                    value={payment?.paymentIntentId ?? "—"}
                  />
                </>
              )}

              {!booking && !error && (
                <p className="text-muted">
                  No hemos podido recuperar los detalles, pero la reserva
                  aparecerá en tu lista.
                </p>
              )}
            </Card.Body>
          </Card>

          <div className="mt-3 d-flex flex-wrap gap-2">
            <Button
              variant="outline-dark"
              onClick={() => navigate("/myBookings")}
            >
              Ver mis reservas
            </Button>
            <Button
              className="airb2b-btn-primary"
              onClick={() => navigate("/")}
            >
              Volver al inicio
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="small text-muted">Total</div>
                  <div className="fs-3 fw-bold">{formatCurrency(price)}</div>
                </div>
                <Badge
                  bg={
                    isSucceeded
                      ? "success"
                      : isProcessing
                      ? "info"
                      : isFailed
                      ? "danger"
                      : "secondary"
                  }
                  className="px-3 py-2"
                >
                  {isSucceeded
                    ? "Pagado"
                    : isProcessing
                    ? "Procesando"
                    : isFailed
                    ? "Fallido"
                    : "—"}
                </Badge>
              </div>
              <hr />
              <p className="text-muted small mb-0">
                Recibirás la confirmación por email. Puedes ver el estado en
                cualquier momento desde{" "}
                <Link to="/myBookings">tus reservas</Link>.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentSuccess;
