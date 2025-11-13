import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import service from "../services/service.config";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function PaginaResultados() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [cityCoords, setCityCoords] = useState([40.4169, -3.7034]);

  const location = useLocation();

  // recalcula la query cada vez que cambia location.search
  const { city } = useMemo(() => queryString.parse(location.search), [location.search]);

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

    let mounted = true; // para evitar setState si el componente se desmonta

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await service.get(
          `/accommodation/with-reviews?city=${encodeURIComponent(city)}`
        );

        if (!mounted) return;
        setResults(res.data || []);
        console.log(res.data);

        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            city + ", Spain"
          )}`
        );
        const geoData = await geoRes.json();
        if (!mounted) return;
        if (geoData.length > 0) {
          const { lat, lon } = geoData[0];
          setCityCoords([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Error buscando alojamientos:", err);
        setError("Error buscando alojamientos");
        setResults([]);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      mounted = false;
    };
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
                style={{ textDecoration: "none", borderRadius: "20px", overflow: "hidden", position: "relative" }}
              >
                <Card.Img
                  src={acc.photos?.[0] || "/placeholder.png"}
                  alt="Alojamiento"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              </Card>
              <div>
                <h7>{acc.title}</h7>
                <p>{(acc.cost ?? 0) * 2}€ por dos noches</p>
                <p>{acc.city} · ☆ {acc.avgStars?.toFixed(1) ?? "—"} </p>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default PaginaResultados;