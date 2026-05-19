import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import service from "../services/service.config";
import EmptyState, { ChatBubbleIcon } from "../components/EmptyState";

function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await service.get("/review/own");
        if (!cancelled)
          setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error al cargar tus reseñas:", err);
        if (!cancelled) setError("No se pudieron cargar tus reseñas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta reseña?")) return;
    try {
      await service.delete(`/review/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la reseña.");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="page-title mb-4">Mis reseñas</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      {reviews.length === 0 ? (
        <EmptyState
          icon={ChatBubbleIcon}
          title="Aún no has escrito reseñas"
          text="Cuando hayas viajado podrás compartir tu experiencia con la comunidad."
          action={
            <Button as={Link} to="/" className="airb2b-btn-primary">
              Explorar alojamientos
            </Button>
          }
        />
      ) : (
        <Row className="g-3">
          {reviews.map((r) => (
            <Col xs={12} md={6} key={r._id}>
              <Card className="review-card border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 h6">
                      <Link
                        to={`/housingdetails/${r.accommodation?._id || ""}`}
                        className="text-decoration-none"
                      >
                        {r.accommodation?.title ?? "Alojamiento"}
                      </Link>
                    </Card.Title>
                    <span className="housing-details__rating">★ {r.stars}</span>
                  </div>
                  <div className="small text-muted mb-2">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("es-ES")
                      : ""}
                  </div>
                  <div className="fw-semibold">{r.title}</div>
                  <p className="mb-2 text-muted">{r.text}</p>
                  <div className="d-flex justify-content-end">
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
      )}
    </Container>
  );
}

export default MyReviewsPage;
