import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Pagination,
  Row,
  Col,
  Spinner,
  Container,
  Button,
} from "react-bootstrap";
import { AuthContext } from "../context/auth.context";

function Carousel4({ setShowLoginModal }) {
  const {
    favoritesFull = [],
    favorites = [],
    toggleFavorite,
    isLoggedIn,
  } = useContext(AuthContext);

  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    if (favoritesFull.length === 0 && favorites.length > 0) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(t);
    }
    setLoading(false);
  }, [favoritesFull, favorites]);

  if (!isLoggedIn) return null;

  const totalItems = favoritesFull.length;
  const maxStart = Math.max(0, totalItems - pageSize);
  const visible = favoritesFull.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setStartIndex((prev) => Math.min(maxStart, prev + 1));

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
          <Pagination.Next
            onClick={handleNext}
            disabled={startIndex >= maxStart}
          />
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
          {visible.map((eachAcc) => (
            <Col key={eachAcc._id} xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card
                as={Link}
                to={`/housingdetails/${eachAcc._id}`}
                style={{
                  textDecoration: "none",
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Card.Img
                  src={eachAcc.photos?.[0] || "/placeholder.png"}
                  alt={eachAcc.title}
                  loading="lazy"
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
                <Card.ImgOverlay>
                  <Button
                    variant="link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isLoggedIn) {
                        setShowLoginModal(true);
                        return;
                      }
                      toggleFavorite(eachAcc._id);
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "transparent",
                      border: "none",
                    }}
                  >
                    <img
                      src="/corazon-rojo.png"
                      alt="Quitar favorito"
                      style={{ width: 40, height: 40, pointerEvents: "none" }}
                    />
                  </Button>
                </Card.ImgOverlay>
              </Card>

              <div>
                <h5 style={{ margin: "0.5rem 0 0.25rem 0" }}>
                  {eachAcc.title}
                </h5>
                <p style={{ margin: 0 }}>
                  {(eachAcc.cost ?? eachAcc.price ?? 0) * 2}€ por dos noches
                </p>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Carousel4;
