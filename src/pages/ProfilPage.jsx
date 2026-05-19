import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import service from "../services/service.config";
import HousingCard from "../components/HousingCard";
import EmptyState, { SuitcaseIcon } from "../components/EmptyState";

function ProfilePage() {
  const [section, setSection] = useState("about");
  const [profile, setProfile] = useState(null);
  const [ownCount, setOwnCount] = useState(0);
  const [trips, setTrips] = useState(0);
  const [housesTrips, setHousesTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [profileRes, ownRes, tripsRes] = await Promise.all([
          service.get("/user/profile"),
          service.get("/accommodation/own"),
          service.get("/booking/trips"),
        ]);
        if (cancelled) return;
        setProfile(profileRes.data || null);
        setOwnCount(Array.isArray(ownRes.data) ? ownRes.data.length : 0);

        const { count, accommodations, bookings } = tripsRes.data || {};
        setTrips(typeof count === "number" ? count : bookings?.length ?? 0);
        let housesArray = [];
        if (Array.isArray(accommodations) && accommodations.length > 0) {
          housesArray = accommodations;
        } else if (Array.isArray(bookings)) {
          const map = new Map();
          bookings.forEach((b) => {
            if (b.accommodation?._id)
              map.set(String(b.accommodation._id), b.accommodation);
          });
          housesArray = Array.from(map.values());
        }
        setHousesTrips(housesArray);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("No se pudo cargar tu perfil.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const initial = profile?.username
    ? profile.username.charAt(0).toUpperCase()
    : "?";

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="profile-page py-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="profile-tabs-bar">
        <button
          type="button"
          onClick={() => setSection("about")}
          className={`profile-tab ${section === "about" ? "is-active" : ""}`}
        >
          Sobre mí
        </button>
        <button
          type="button"
          onClick={() => setSection("trips")}
          className={`profile-tab ${section === "trips" ? "is-active" : ""}`}
        >
          Viajes anteriores
        </button>
      </div>

      {section === "about" && (
        <div className="profile-about mt-4">
          <div className="profile-card profile-card--center-content">
            <div className="profile-card__avatar">
              {profile?.photo ? (
                <img src={profile.photo} alt="Foto de perfil" />
              ) : (
                <div className="profile-card__avatar--initial">{initial}</div>
              )}
            </div>
            <div className="profile-card__info">
              <h2 className="mb-1">{profile?.username || "Usuario"}</h2>
              {profile?.email && (
                <div className="text-muted small mb-3">{profile.email}</div>
              )}
              <div className="profile-card__stats">
                <div>
                  <strong>{trips}</strong>
                  <span>viajes</span>
                </div>
                <div>
                  <strong>{ownCount}</strong>
                  <span>alojamientos</span>
                </div>
              </div>
              <Button
                as={Link}
                to="/editProfile"
                className="airb2b-btn-primary mt-3"
              >
                Editar perfil
              </Button>
            </div>
          </div>
        </div>
      )}

      {section === "trips" && (
        <div className="mt-4">
          <h2 className="h4 mb-3">Viajes anteriores</h2>
          {housesTrips.length === 0 ? (
            <EmptyState
              icon={SuitcaseIcon}
              title="Aún no has hecho ningún viaje"
              text="Empieza a explorar destinos increíbles en AirB2B."
              action={
                <Button as={Link} to="/" className="airb2b-btn-primary">
                  Explorar alojamientos
                </Button>
              }
            />
          ) : (
            <Row className="g-4">
              {housesTrips.map((acc) => (
                <Col key={acc._id} xs={12} sm={6} md={4} lg={3}>
                  <HousingCard acc={acc} showFavorite={false} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </Container>
  );
}

export default ProfilePage;
