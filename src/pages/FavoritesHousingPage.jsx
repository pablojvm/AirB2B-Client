import { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import service from "../services/service.config";

function FavoritesHousingPage() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext)

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await service.get(`/accommodation/favorites`);
      setHouses(response.data ?? []);
    } catch (error) {
      console.log("Error al obtener favoritos:", error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4" style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (!houses || houses.length === 0) {
    return (
      <Container className="mt-4">
        <h1 className="mb-4">Tus favoritos</h1>
        <Alert variant="info">Aún no tienes alojamientos favoritos.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Tus favoritos</h1>

      <Row className="g-4 justify-content-start">
        {houses.map((eachAcc, idx) => (
          <Col
            key={eachAcc._id || idx}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <Card
              className="border-0 shadow-sm h-100"
              as={Link}
              to={`/housingdetails/${eachAcc._id}`}
              style={{
                textDecoration: "none",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <Card.Img
                src={eachAcc.photos?.[0] || "/placeholder.png"}
                alt={eachAcc.title || "Alojamiento"}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  width: "100%",
                }}
                loading="lazy"
              />
              <Card.Body className="text-center">
                <Card.Title style={{ fontSize: "1rem" }}>{eachAcc.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FavoritesHousingPage;
