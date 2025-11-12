import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import service from "../services/service.config";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function useQuery() {
  return queryString.parse(window.location.search);
}

function PaginaResultados() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [cityCoords, setCityCoords] = useState([40.4169, -3.7034]);

  const { city } = useQuery();

  const customMarker = L.icon({
    iconUrl: "/marker.png",
    iconSize: [60, 95],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  useEffect(() => {
    if (!city) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // Trae alojamientos con estrellas promedio
        const res = await service.get(
          `/accommodation/with-reviews?city=${encodeURIComponent(city)}`
        );
        setResults(res.data || []);
        console.log(res.data)

        // Obtiene coordenadas de la ciudad para centrar el mapa
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            city + ", Spain"
          )}`
        );
        const geoData = await geoRes.json();
        if (geoData.length > 0) {
          const { lat, lon } = geoData[0];
          setCityCoords([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (err) {
        console.error("Error buscando alojamientos:", err);
        setError("Error buscando alojamientos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [city]);

  if (isLoading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="py-4">
      <h3>
        Resultados para: <strong>{city}</strong>
      </h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ height: 400, marginBottom: 20 }}>
        <MapContainer
          center={cityCoords}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {results.map(
            (acc) =>
              acc.location?.coordinates && (
                <Marker
                  key={acc._id}
                  position={[
                    acc.location.coordinates[1],
                    acc.location.coordinates[0],
                  ]}
                  icon={customMarker}
                >
                  <Popup>
                    <strong>{acc.title}</strong>
                    <br />
                    {acc.city} · ☆ {acc.avgStars?.toFixed(1) ?? "—"}
                    <br />
                    <Link to={`/housingdetails/${acc._id}`}>Ver detalles</Link>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>

      {results.length === 0 ? (
        <p className="text-muted">
          No se han encontrado alojamientos en {city}.
        </p>
      ) : (
        <Row className="g-3 mt-3">
          {results.map((acc) => (
            <Col key={acc._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                as={Link}
                to={`/housingdetails/${acc._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className="h-100 shadow-sm"
              >
                <div style={{ height: 160, overflow: "hidden" }}>
                  <Card.Img
                    src={acc.photos?.[0] ?? "/imagenpre.webp"}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title style={{ fontSize: 16 }}>{acc.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {acc.city} · ☆ {acc.avgStars?.toFixed(1) ?? "—"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default PaginaResultados;