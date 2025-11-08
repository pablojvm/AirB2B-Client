import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from "../services/service.config";
import { Card, Pagination, Row, Col, Spinner, Container } from "react-bootstrap";
import { AuthContext } from "../context/auth.context";

function Carousel4() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext); // 👈 Saber si está logueado

  const [acc, setAcc] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 6;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      getData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setStartIndex(0);
  }, [acc]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await service.get(`/accommodation/favorites`);
      setAcc(response.data ?? []);
    } catch (error) {
      console.log(error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  // Si no está logueado, no renderizamos nada
  if (!isLoggedIn) return null;

  const totalItems = acc.length;
  const maxStart = Math.max(0, totalItems - pageSize);
  const visible = acc.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1)); // mover 1 hacia atrás
  const handleNext = () => setStartIndex((prev) => Math.min(maxStart, prev + 1)); // mover 1 hacia adelante

  return (
    <Container className="mt-4">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Tus favoritos</h2>

        <Pagination className="m-0">
          <Pagination.Prev onClick={handlePrev} disabled={startIndex === 0} />
          <Pagination.Next onClick={handleNext} disabled={startIndex >= maxStart} />
        </Pagination>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
          <Spinner animation="border" role="status" />
        </div>
      ) : totalItems === 0 ? (
        <p className="text-muted mt-3">No hay alojamientos para mostrar.</p>
      ) : (
        <Row className="g-4 justify-content-start">
          {visible.map((eachAcc, idx) => (
            <Col key={eachAcc._id ?? startIndex + idx} xs={12} sm={6} md={4} lg={3} xl={2}>
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
                  alt="Alojamiento"
                  loading="lazy"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />

                <Card.Body className="text-center d-flex flex-column">
                  <div style={{ flex: 1 }}>
                    <Card.Title style={{ fontSize: "1rem" }}>{eachAcc.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{eachAcc.cost}€</Card.Subtitle>
                  </div>
                  <Card.Text
                    style={{
                      fontSize: "0.85rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {eachAcc.description}
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

export default Carousel4;
