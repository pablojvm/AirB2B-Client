import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import service from "../services/service.config";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const [section, setSection] = useState("sobreMi");
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    // cargar profile y trips al montar
    getProfile();
    fetchTripsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await service.get("user/profile");
      setProfile(response.data);
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
      const token = localStorage.getItem("authToken"); // ajusta si usas otro key
      const res = await service.get("booking/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // asumo que el backend devuelve un número (count). Si devuelve {count: n} ajusta.
      // Aquí manejamos ambos casos:
      const data = res.data;
      const count = typeof data === "number" ? data : data.count ?? 0;
      setTrips(count);
    } catch (error) {
      console.error("Error fetching trips count:", error);
      // no redirectamos aquí; solo mostramos 0 o mensaje si falla
    } finally {
      setLoadingTrips(false);
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
                      width: "300px",
                      padding: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <div className="text-center" style={{ display: "flex" }}>
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
                              margin: "0 auto",
                            }}
                          />
                        )}

                        <h4 style={{ marginTop: "10px" }}>
                          {profile?.username || "Usuario"}
                        </h4>
                      </div>
                      <div>
                        <div style={{ marginTop: 8 }}>
                          {loadingTrips ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <div>
                              <strong>{trips}</strong>
                              <div
                                style={{ fontSize: "0.9rem", color: "#666" }}
                              >
                                viajes realizados
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Button variant="danger" style={{ marginTop: "20px" }}>
                    Completa tu perfil
                  </Button>
                </div>
              )}

              {section === "viajes" && (
                <div>
                  <h2>Viajes anteriores</h2>
                  <p>No hay viajes anteriores todavía.</p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
