// src/pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from "query-string";
import service from "../services/service.config";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

function useQuery() {
  return queryString.parse(window.location.search);
}

function PaginaResultados() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const { city } = useQuery();

  useEffect(() => {
    if (!city) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await service.get(`/accommodation?city=${encodeURIComponent(city)}`);
        setResults(res.data || []);
      } catch (err) {
        console.error("Error buscando alojamientos:", err);
        setError("Error buscando alojamientos");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [city]);

  if (isLoading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
    </Container>
  );

  return (
    <Container className="py-4">
      <h3>Resultados para: <strong>{city}</strong></h3>
      {error && <div className="alert alert-danger">{error}</div>}

      {results.length === 0 ? (
        <p className="text-muted">No se han encontrado alojamientos en {city}.</p>
      ) : (
        <Row className="g-3 mt-3">
          {results.map((acc) => (
            <Col key={acc._id} xs={12} sm={6} md={4} lg={3}>
              <Card as={Link} to={`/housingdetails/${acc._id}`} style={{ textDecoration: "none", color: "inherit" }} className="h-100 shadow-sm">
                <div style={{ height: 160, overflow: "hidden" }}>
                  <Card.Img src={acc.photos?.[0] ?? "/imagenpre.webp"} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
                <Card.Body>
                  <Card.Title style={{ fontSize: 16 }}>{acc.title}</Card.Title>
                  <Card.Text className="text-muted">{acc.city} · ☆ {acc.stars ?? "—"}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default PaginaResultados