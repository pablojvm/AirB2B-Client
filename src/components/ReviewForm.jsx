import { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import service from "../services/service.config";

function ReviewForm({ accommodationId, onNewReview }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("El título debe tener al menos 3 caracteres");
      return;
    }
    if (text.trim().length < 15) {
      setError("El texto debe tener al menos 15 caracteres");
      return;
    }

    try {
      setLoading(true);
      const response = await service.post("/review", {
        title: title.trim(),
        text: text.trim(),
        stars,
        accommodation: accommodationId,
      });
      onNewReview?.(response.data);
      setTitle("");
      setText("");
      setStars(5);
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar la reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="review-form mb-3 border-0 shadow-sm">
      <Card.Body>
        <h5 className="mb-3">Escribe una reseña</h5>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label className="small text-muted">Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Una estancia increíble"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="small text-muted">
              Tu opinión (mínimo 15 caracteres)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">Valoración</Form.Label>
            <div className="review-form__stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setStars(n)}
                  className={`review-form__star ${stars >= n ? "is-active" : ""}`}
                  aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
              <span className="ms-2 text-muted small">{stars}/5</span>
            </div>
          </Form.Group>

          <Button
            type="submit"
            className="airb2b-btn-primary"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Enviar reseña"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ReviewForm;
