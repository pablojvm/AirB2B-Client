import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Container,
  Badge,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import service from "../services/service.config";
import EmptyState, { CalendarIcon, SuitcaseIcon } from "../components/EmptyState";

function MyBookingsPage() {
  const [pending, setPending] = useState([]);
  const [past, setPast] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingPast, setLoadingPast] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pendingRes, pastRes] = await Promise.all([
          service.get("/booking/tripsPending"),
          service.get("/booking/lastTrips"),
        ]);
        if (cancelled) return;
        setPending(pendingRes.data.bookings || []);
        setPast(pastRes.data.bookings || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("No se pudieron cargar tus reservas.");
      } finally {
        if (!cancelled) {
          setLoadingPending(false);
          setLoadingPast(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const statusBadge = (status) => {
    const map = {
      pending: { bg: "warning", text: "dark", label: "Pago pendiente" },
      accepted: { bg: "success", text: "light", label: "Confirmada" },
      confirmed: { bg: "success", text: "light", label: "Confirmada" },
      cancelled: { bg: "secondary", text: "light", label: "Cancelada" },
    };
    const cfg = map[status] || { bg: "info", text: "light", label: status || "—" };
    return (
      <Badge bg={cfg.bg} text={cfg.text} className="booking-badge">
        {cfg.label}
      </Badge>
    );
  };

  const renderBookingCard = (booking) => {
    const acc = booking.accommodation || {};
    const start = booking.start ? new Date(booking.start) : null;
    const end = booking.end ? new Date(booking.end) : null;
    const linkTo =
      booking.status === "pending"
        ? `/payment/${booking._id}`
        : `/housingdetails/${acc._id || ""}`;
    return (
      <Col key={booking._id} xs={12} sm={6} md={4} lg={3}>
        <Card as={Link} to={linkTo} className="booking-list-card">
          <div className="booking-list-card__media">
            <img
              src={acc.photos?.[0] || "/imagenpre.webp"}
              alt={acc.title || "Alojamiento"}
              loading="lazy"
            />
          </div>
          <Card.Body>
            <Card.Title className="h6 mb-1">
              {acc.title || "Alojamiento"}
            </Card.Title>
            <div className="small text-muted mb-2">
              {start ? start.toLocaleDateString("es-ES") : "—"} —{" "}
              {end ? end.toLocaleDateString("es-ES") : "—"}
            </div>
            {statusBadge(booking.status)}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Container className="py-4">
      <h1 className="page-title mb-4">Tus reservas</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <section className="mb-5">
        <h2 className="h5 mb-3">Próximas y pendientes</h2>
        {loadingPending ? (
          <div className="py-4 text-center">
            <Spinner animation="border" />
          </div>
        ) : pending.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title="No tienes reservas activas"
            text="Cuando reserves un alojamiento aparecerá aquí con sus fechas y estado de pago."
            action={
              <Button as={Link} to="/" className="airb2b-btn-primary">
                Buscar alojamientos
              </Button>
            }
          />
        ) : (
          <Row className="g-3">{pending.map(renderBookingCard)}</Row>
        )}
      </section>

      <section>
        <h2 className="h5 mb-3">Viajes anteriores</h2>
        {loadingPast ? (
          <div className="py-4 text-center">
            <Spinner animation="border" />
          </div>
        ) : past.length === 0 ? (
          <EmptyState
            icon={SuitcaseIcon}
            title="Aún no tienes viajes terminados"
            text="Aquí guardaremos tu historial de estancias."
            variant="muted"
          />
        ) : (
          <Row className="g-3">{past.map(renderBookingCard)}</Row>
        )}
      </section>
    </Container>
  );
}

export default MyBookingsPage;
