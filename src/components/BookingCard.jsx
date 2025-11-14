import { useState, useContext } from "react";
import { Card, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import service from "../services/service.config";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function BookingCard({ accommodation, minNights = 1, maxGuests = 8, onBooked }) {
  const { accommodationId } = useParams();
  const { loggedUserId, isLoggedIn } = useContext(AuthContext);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pricePerNight = Number(accommodation?.cost ?? 0);

  const parseDate = (d) => {
    if (!d) return null;
    const parts = d.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  };

  const nightsCount = () => {
    const start = parseDate(from);
    const end = parseDate(to);
    if (!start || !end) return 0;
    const diffMs = end - start;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const total = nightsCount() * pricePerNight;

  const validate = () => {
    if (!from || !to) return "Selecciona fecha de entrada y salida";
    const nights = nightsCount();
    if (nights <= 0) return "La fecha de salida debe ser posterior a la de entrada";
    if (nights < minNights) return `La estancia mínima son ${minNights} noche(s)`;
    if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)
      return `Número de huéspedes entre 1 y ${maxGuests}`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isLoggedIn) {
      setError("Debes iniciar sesión para realizar una reserva.");
      return;
    }

    try {
      setLoading(true);
      console.log(loggedUserId)
      console.log(total)
      const newBooking = {
        accommodationId: accommodationId,
        userId: loggedUserId,
        start: from,
        end: to,
        cost: total,
        guests: guests
      };

      const res = await service.post("/booking/new", newBooking);
      setSuccess("Reserva realizada correctamente");
      setError("");
      onBooked?.(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message ?? "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 420, width: "100%" }} className="p-3 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <div>
            {accommodation?.title ?? "Alojamiento"}
            <div style={{ fontSize: 12, color: "#666" }}>
              {pricePerNight} € / noche
            </div>
          </div>
        </Card.Title>

        <Form onSubmit={handleSubmit}>
          <Row className="g-2 mb-2">
            <Col xs={12} sm={6}>
              <Form.Group controlId="from">
                <Form.Label>Entrada</Form.Label>
                <Form.Control
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group controlId="to">
                <Form.Label>Salida</Form.Label>
                <Form.Control
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-2 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group controlId="guests">
                <Form.Label>Huéspedes</Form.Label>
                <Form.Control
                  type="number"
                  value={guests}
                  min={1}
                  max={maxGuests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} className="d-flex align-items-end justify-content-end">
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{nightsCount()} noche(s)</div>
                <div style={{ color: "#666" }}>
                  Total <strong>{total} €</strong>
                </div>
              </div>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="d-grid">
            <Button type="submit" disabled={loading || total === 0} variant="primary">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Reservando...
                </>
              ) : (
                `Reservar — ${total} €`
              )}
            </Button>
          </div>
        </Form>

        <small className="text-muted d-block mt-2">
          No se te cobrará nada todavia. Deberás acceder al pago en tus reservas.
        </small>
      </Card.Body>
    </Card>
  );
}

export default BookingCard;
