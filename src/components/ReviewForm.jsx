import { useState } from "react";
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
    setLoading(true);

    if (text.length < 15) {
      setError("El texto debe tener al menos 15 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await service.post("/review", {
        title,
        text,
        stars,
        accommodation: accommodationId
      });
      onNewReview(response.data); // enviar la nueva reseña al componente padre
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
    <div className="card p-3 mb-3">
      <h5>Escribe una reseña</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <textarea
            className="form-control"
            placeholder="Escribe tu reseña (mínimo 15 caracteres)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label>Valoración:</label>
          <select
            className="form-select"
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar reseña"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
