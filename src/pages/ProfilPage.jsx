import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import service from "../services/service.config";
import { useNavigate, Link } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const [section, setSection] = useState("sobreMi");
  const [number, setNumber] = useState(0);
  const [loadingNumber, setLoadingNumber] = useState(true);
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [housesTrips, setHousesTrips] = useState([]);
  const [loadingHouses, setLoadingHouses] = useState(true);

  useEffect(() => {
    getNumberHouses();
    getProfile();
    fetchTripsCount();
  }, []);

  const getNumberHouses = async () => {
    try {
      setLoadingNumber(true);
      const response = await service.get("/accommodation/own");
      const payload = response.data;
      const count = Array.isArray(payload)
        ? payload.length
        : typeof payload === "number"
        ? payload
        : 0;
      setNumber(count);
    } catch (error) {
      console.error("Error fetching number houses:", error);
      setNumber(0);
    } finally {
      setLoadingNumber(false);
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await service.get("/user/profile");
      setProfile(response.data ?? null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const fetchTripsCount = async () => {
    try {
      setLoadingTrips(true);
      setLoadingHouses(true);
      const response = await service.get("/booking/trips");
      const { count, accommodations, bookings } = response.data ?? {};
      setTrips(typeof count === "number" ? count : bookings?.length ?? 0);
      let housesArray = [];
      if (Array.isArray(accommodations) && accommodations.length > 0) {
        housesArray = accommodations;
      } else if (Array.isArray(bookings) && bookings.length > 0) {
        const raw = bookings.map((b) => b.accommodation).filter(Boolean);
        const byId = new Map();
        raw.forEach((a) => byId.set(String(a._id), a));
        housesArray = Array.from(byId.values());
      } else {
        housesArray = [];
      }
      setHousesTrips(housesArray);
    } catch (error) {
      console.error("Error fetching trips count:", error);
      setTrips(0);
      setHousesTrips([]);
    } finally {
      setLoadingTrips(false);
      setLoadingHouses(false);
    }
  };

  const initial = profile?.username
    ? profile.username.charAt(0).toUpperCase()
    : "?";

  return (
    <Container fluid style={{ padding: "40px" }}>
      <Row>
        <Col md={3} style={{ borderRight: "1px solid #ddd" }}>
          <ul className="list-unstyled">
            <li
              onClick={() => setSection("sobreMi")}
              style={{
                padding: "10px 0",
                fontWeight: section === "sobreMi" ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              Sobre mí
            </li>
            <li
              onClick={() => setSection("viajes")}
              style={{
                padding: "10px 0",
                fontWeight: section === "viajes" ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              Viajes anteriores
            </li>
          </ul>
        </Col>

        <Col md={9}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              {section === "sobreMi" && (
                <div>
                  <h2>Sobre mí</h2>
                  <Card
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      padding: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      className="d-flex"
                      style={{
                        gap: 20,
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div>
                          {!profile?.photo ? (
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#000",
                                color: "#fff",
                                fontSize: "24px",
                                lineHeight: "60px",
                                textAlign: "center",
                                margin: "0 auto",
                              }}
                              aria-hidden
                            >
                              {initial}
                            </div>
                          ) : (
                            <img
                              src={profile.photo}
                              alt="Foto de perfil"
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          )}
                        </div>

                        <div>
                          <h4 style={{ margin: 0, textAlign: "center" }}>
                            {profile?.username || "Usuario"}
                          </h4>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 24,
                          alignItems: "center",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          {loadingTrips ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <strong
                                style={{ display: "block", fontSize: 18 }}
                              >
                                {trips}
                              </strong>
                              <div
                                style={{ fontSize: "0.9rem", color: "#666" }}
                              >
                                viajes realizados
                              </div>
                            </>
                          )}
                        </div>

                        <div style={{ textAlign: "center" }}>
                          {loadingNumber ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <strong
                                style={{ display: "block", fontSize: 18 }}
                              >
                                {number}
                              </strong>
                              <div
                                style={{ fontSize: "0.9rem", color: "#666" }}
                              >
                                alojamientos
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Button
                    as={Link}
                    to="/editProfile"
                    variant="danger"
                    style={{ marginTop: "20px" }}
                  >
                    Cambia tu foto
                  </Button>
                </div>
              )}

              {section === "viajes" && (
                <Container className="mt-4">
                  <h2 className="mb-4">Viajes anteriores</h2>

                  {loadingHouses ? (
                    <div className="text-center">
                      <Spinner animation="border" />
                    </div>
                  ) : Array.isArray(housesTrips) && housesTrips.length > 0 ? (
                    <Row className="g-4 justify-content-start">
                      {housesTrips.map((acc) => (
                        <Col
                          key={acc?._id ?? Math.random()}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          xl={2}
                        >
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
                              src={acc.photos?.[0] ?? "/placeholder.png"}
                              alt={acc.title ?? "Alojamiento"}
                              style={{
                                height: "200px",
                                objectFit: "cover",
                                width: "100%",
                              }}
                              loading="lazy"
                            />
                            <Card.Body className="text-center">
                              <Card.Title>{acc.title}</Card.Title>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center mt-4">
                      <img src="/maleta.png" width="100" alt="Sin viajes" />
                      <h4 className="mt-3">Aún no has hecho ningún viaje</h4>
                      <Button
                        as={Link}
                        to="/search"
                        variant="outline-dark"
                        className="mt-3"
                      >
                        Explorar alojamientos
                      </Button>
                    </div>
                  )}
                </Container>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
