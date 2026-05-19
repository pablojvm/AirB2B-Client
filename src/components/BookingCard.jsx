import { useState, useContext, useMemo } from "react";
import { Card, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import service from "../services/service.config";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function BookingCard({
  accommodation,
  minNights = 1,
  maxGuests,
  onBooked,
}) {
  const { accommodationId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal } = useContext(AuthContext);

  const effectiveMaxGuests = Number(accommodation?.maxPeople) || maxGuests || 8;

  const today = new Date().toISOString().slice(0, 10);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pricePerNight = Number(accommodation?.cost ?? 0);

  const nightsCount = useMemo(() => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [from, to]);

  const total = nightsCount * pricePerNight;

  const validate = () => {
    if (!from || !to) return "Selecciona fecha de entrada y salida";
    if (new Date(from) < new Date(today)) return "La entrada no puede ser anterior a hoy";
    if (nightsCount <= 0) return "La fecha de salida debe ser posterior a la de entrada";
    if (nightsCount < minNights) return `La estancia mínima son ${minNights} noche(s)`;
    if (!Number.isInteger(guests) || guests < 1 || guests > effectiveMaxGuests)
      return `Número de huéspedes entre 1 y ${effectiveMaxGuests}`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await service.post("/booking/new", {
        accommodationId,
        start: from,
        end: to,
        cost: total,
        guests,
      });
      setSuccess("Reserva creada. Te llevamos al pago…");
      onBooked?.(res.data);
      // Navegamos al pago de esa reserva
      const id = res.data?._id;
      if (id) {
        setTimeout(() => navigate(`/payment/${id}`), 500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message ?? "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="booking-card shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-baseline justify-content-between mb-3">
          <div>
            <div className="booking-card__price">
              <strong>{pricePerNight}€</strong>{" "}
              <span className="text-muted">noche</span>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit} className="booking-card__form">
          <Row className="g-2 mb-2">
            <Col xs={6}>
              <Form.Group controlId="from">
                <Form.Label className="small text-muted mb-1">Entrada</Form.Label>
                <Form.Control
                  type="date"
                  value={from}
                  min={today}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="to">
                <Form.Label className="small text-muted mb-1">Salida</Form.Label>
                <Form.Control
                  type="date"
                  value={to}
                  min={from || today}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="guests" className="mb-3">
            <Form.Label className="small text-muted mb-1">Huéspedes</Form.Label>
            <Form.Control
              type="number"
              value={guests}
              min={1}
              max={effectiveMaxGuests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
            />
          </Form.Group>

          {nightsCount > 0 && (
            <div className="booking-card__summary mb-3">
              <div className="d-flex justify-content-between">
                <span>
                  {pricePerNight}€ × {nightsCount} noche
                  {nightsCount > 1 ? "s" : ""}
                </span>
                <span>{total}€</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>{total}€</span>
              </div>
            </div>
          )}

          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          {success && <Alert variant="success" className="py-2">{success}</Alert>}

          <Button
            type="submit"
            disabled={loading || total === 0}
            className="airb2b-btn-primary w-100"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Reservando…
              </>
            ) : total > 0 ? (
              `Reservar — ${total}€`
            ) : (
              "Selecciona fechas"
            )}
          </Button>
        </Form>

        <small className="text-muted d-block mt-2 text-center">
          No se te cobrará todavía. El pago se completa en el siguiente paso.
        </small>
      </Card.Body>
    </Card>
  );
}

export default BookingCard;
