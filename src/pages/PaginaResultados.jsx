import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import service from "../services/service.config";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import HousingCard from "../components/HousingCard";

function PaginaResultados() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [cityCoords, setCityCoords] = useState([40.4169, -3.7034]);

  const location = useLocation();
  const { city } = useMemo(
    () => queryString.parse(location.search),
    [location.search]
  );

  const customMarker = useMemo(
    () =>
      L.icon({
        iconUrl: "/marker.png",
        iconSize: [48, 76],
        iconAnchor: [24, 76],
        popupAnchor: [0, -76],
      }),
    []
  );

  useEffect(() => {
    if (!city) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await service.get(
          `/accommodation/with-reviews?city=${encodeURIComponent(city)}`
        );
        if (cancelled) return;
        setResults(Array.isArray(res.data) ? res.data : []);

        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              `${city}, Spain`
            )}`
          );
          const geoData = await geoRes.json();
          if (!cancelled && Array.isArray(geoData) && geoData.length > 0) {
            const { lat, lon } = geoData[0];
            setCityCoords([parseFloat(lat), parseFloat(lon)]);
          }
        } catch {
          // Si falla Nominatim no es bloqueante
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error buscando alojamientos:", err);
          setError("Error buscando alojamientos");
          setResults([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (isLoading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="py-4 search-results">
      <h2 className="mb-1">
        Resultados para <strong>{city || "—"}</strong>
      </h2>
      <p className="text-muted">
        {results.length} alojamiento{results.length !== 1 ? "s" : ""} encontrado
        {results.length !== 1 ? "s" : ""}
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="search-results__map">
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
                    {acc.city}
                    {acc.avgStars
                      ? ` · ★ ${Number(acc.avgStars).toFixed(1)}`
                      : ""}
                    <br />
                    <Link to={`/housingdetails/${acc._id}`}>Ver detalles</Link>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>

      {results.length === 0 ? (
        <p className="text-muted mt-4">
          No se han encontrado alojamientos en {city || "esa ciudad"}.
        </p>
      ) : (
        <Row className="g-4 mt-1">
          {results.map((acc) => (
            <Col key={acc._id} xs={12} sm={6} md={4} lg={3}>
              <HousingCard
                acc={acc}
                extra={
                  acc.avgStars ? (
                    <span className="housing-card__rating">
                      ★ {Number(acc.avgStars).toFixed(1)}
                    </span>
                  ) : null
                }
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default PaginaResultados;
