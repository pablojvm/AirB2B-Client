import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AuthContext } from "../context/auth.context";
import service from "../services/service.config";
import { useNavigate, Link } from "react-router-dom";

function MyReviewsPage() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchMyReviews();
  }, [isLoggedIn]);

  const fetchMyReviews = async () => {
    try {
      const response = await service.get("/review/own");
      console.log(response.data)
      setReviews(response.data);
    } catch (error) {
      console.log("Error al cargar tus reseñas:", error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta reseña?")) return;
    try {
      await service.delete(`/review/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.log("Error al eliminar reseña:", error);
      alert("No se pudo eliminar la reseña.");
    }
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <img src="/airbnb.gif" alt="loading" />
      </div>
    );

  if (reviews.length === 0)
    return (
      <Container className="mt-4">
        <h2>Mis reseñas</h2>
        <p>No has escrito ninguna reseña todavía.</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <h2>Mis reseñas</h2>
      <Row className="mt-3">
        {reviews.map((r) => (
          <Col xs={12} md={6} key={r._id} className="mb-3">
            <Card as={Link} to={`/housingDetails/${r.accommodation._id}`} style={{textDecoration:"none"}}>
              <Card.Body>
                <Card.Title>
                  {r.accommodation?.title ?? "Alojamiento"} - {r.stars} ⭐
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {new Date(r.createdAt).toLocaleDateString()}
                </Card.Subtitle>
                <Card.Text>
                  <strong>{r.title}</strong>
                  <p>{r.text}</p>
                </Card.Text>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(r._id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MyReviewsPage;
