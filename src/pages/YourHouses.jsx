import { useState, useEffect } from "react";
import { Row, Col, Container, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import service from "../services/service.config";
import HousingCard from "../components/HousingCard";
import EmptyState from "../components/EmptyState";

const HouseImg = (
  <img src="/casa.png" alt="" width="160" style={{ maxWidth: "100%" }} />
);

function YourHouses() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await service.get("/accommodation/own");
        if (!cancelled)
          setHouses(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("No se pudieron cargar tus alojamientos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
        <div>
          <h1 className="page-title mb-0">Tus alojamientos</h1>
          <p className="text-muted mb-0">
            {houses.length} publicado{houses.length !== 1 ? "s" : ""}
          </p>
        </div>
        {houses.length > 0 && (
          <Button as={Link} to="/newHouse" className="airb2b-btn-primary">
            + Publicar alojamiento
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {houses.length === 0 ? (
        <EmptyState
          icon={HouseImg}
          title="Aún no has publicado nada"
          text="Comparte tu espacio en AirB2B y empieza a recibir reservas."
          action={
            <Button as={Link} to="/newHouse" className="airb2b-btn-primary">
              Publicar mi primer alojamiento
            </Button>
          }
        />
      ) : (
        <Row className="g-4">
          {houses.map((acc) => (
            <Col key={acc._id} xs={12} sm={6} md={4} lg={3}>
              <HousingCard acc={acc} showFavorite={false} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default YourHouses;
