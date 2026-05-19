import { useRef } from "react";
import { Spinner, Container } from "react-bootstrap";
import HousingCard from "./HousingCard";

/**
 * Sección horizontal con scroll-snap + flechas para navegar.
 * Reemplaza la paginación manual de los antiguos Carousel1..4.
 */
function CarouselSection({
  title,
  subtitle,
  items = [],
  loading,
  emptyText = "No hay alojamientos para mostrar.",
  onRequireLogin,
}) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "prev" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="carousel-section">
      <Container fluid="lg">
        <div className="carousel-section__header">
          <div>
            <h2 className="carousel-section__title">{title}</h2>
            {subtitle && <p className="carousel-section__subtitle">{subtitle}</p>}
          </div>
          {items.length > 0 && !loading && (
            <div className="carousel-section__nav">
              <button
                type="button"
                aria-label="Anterior"
                onClick={() => scroll("prev")}
                className="carousel-arrow"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                onClick={() => scroll("next")}
                className="carousel-arrow"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="carousel-section__loading">
            <Spinner animation="border" />
          </div>
        ) : items.length === 0 ? (
          <p className="carousel-section__empty">{emptyText}</p>
        ) : (
          <div className="carousel-track" ref={trackRef}>
            {items.map((acc) => (
              <div className="carousel-track__item" key={acc._id}>
                <HousingCard acc={acc} onRequireLogin={onRequireLogin} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default CarouselSection;
