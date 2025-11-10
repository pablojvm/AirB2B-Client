import { useState, useEffect } from "react";
import { Card, Row, Col, Container, Badge, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import service from "../services/service.config";

function MyBookingsPage() {
  const [houses, setHouses] = useState([]);
  const [lastHouses, setLastHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    tripsPending();
    lastTrips();
  }, []);

  const tripsPending = async () => {
    try {
      setLoading(true);
      const response = await service.get(`/booking/tripsPending`);
      setHouses(response.data.bookings ?? []);
    } catch (error) {
      console.error("Error al obtener reservas pendientes:", error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const lastTrips = async () => {
    try {
      setLoading(true);
      const response = await service.get(`/booking/lastTrips`);
      setLastHouses(response.data.bookings ?? []);
    } catch (error) {
      console.error("Error al obtener viajes anteriores:", error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <img src="/airbnb.gif" alt="loading" />
      </div>
    );

  return (
    <div>
      <Container className="mt-4">
        <h1 className="mb-4">Tus reservas</h1>
        {houses.length === 0 && (
          <Alert variant="info">No tienes reservas pendientes.</Alert>
        )}
        <Row className="g-4 justify-content-start">
          {houses.map((booking, idx) => {
            const start = new Date(booking.start);
            const end = new Date(booking.end);
            const acc = booking.accommodation || {};
            return (
              <Col key={booking._id || idx} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card
                  className="border-0 shadow-sm h-100"
                  as={Link}
                  to={
                    booking.status === "pending"
                      ? `/payment/${booking._id}`
                      : `/housingDetails/${acc._id}`
                  }
                  style={{
                    textDecoration: "none",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <Card.Img
                    src={acc.photos?.[0] || "/placeholder.png"}
                    alt={acc.title || "Alojamiento"}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                    loading="lazy"
                  />
                  <Card.Body className="text-center">
                    <Card.Title style={{ fontSize: "1rem" }}>
                      {acc.title || "Alojamiento"}
                    </Card.Title>
                    <Card.Text>
                      Desde {start.toLocaleDateString("es-ES")}
                    </Card.Text>
                    <Card.Text>
                      Hasta {end.toLocaleDateString("es-ES")}
                    </Card.Text>

                    <Badge
                      bg={booking.status === "pending" ? "warning" : "success"}
                      text={booking.status === "pending" ? "dark" : "light"}
                      style={{
                        padding: "0.5em 0.8em",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {booking.status === "pending" ? "Pendiente" : "Aceptada"}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      <Container className="mt-4">
        <h1 className="mb-4">Viajes anteriores</h1>
        {lastHouses.length === 0 && (
          <Alert>¡Aún no tienes reservas terminadas!</Alert>
        )}
        <Row className="g-4 justify-content-start">
          {lastHouses.map((booking, idx) => {
            const acc = booking.accommodation || {};
            return (
              <Col key={booking._id || idx} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card
                  className="border-0 shadow-sm h-100"
                  as={Link}
                  to={`/housingdetails/${acc._id}`}
                  style={{
                    textDecoration: "none",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <Card.Img
                    src={acc.photos?.[0] || "/placeholder.png"}
                    alt={acc.title || "Alojamiento"}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                    loading="lazy"
                  />
                  <Card.Body className="text-center">
                    <Card.Title style={{ fontSize: "1rem" }}>
                      {acc.title || "Alojamiento"}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default MyBookingsPage;
