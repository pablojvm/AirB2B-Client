import { useEffect, useState, useContext, useMemo } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import service from "../services/service.config";
import { AuthContext } from "../context/auth.context";
import BookingCard from "../components/BookingCard";
import ReviewForm from "../components/ReviewForm";

// Marcador "Airbnb" — círculo negro con icono casa
const houseMarker = L.divIcon({
  className: "air-house-marker",
  html: `
    <div class="air-house-marker__dot">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3l9-8z" />
      </svg>
    </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const IMG_SERVICE = {
  "Wi-Fi": "/wifi.png",
  "Air conditioning": "/aire.png",
  Heating: "/radiador.png",
  TV: "/tv.png",
  Washer: "/washer.png",
  Dryer: "/dryer.png",
  Kitchen: "/kitchen.png",
  "Private bathroom": "/bathroom.png",
  "Hair dryer": "/hairDryer.png",
  Shampoo: "/shampoo.png",
  Towels: "/towels.png",
  Iron: "/iron.png",
  Parking: "/parking.png",
  Pool: "/pool.png",
  Gym: "/gym.png",
  "Hot tub": "/jacuzzi.png",
  Balcony: "/balcon.png",
  Garden: "/jardin.png",
  "BBQ grill": "/barbacoa.png",
  Fireplace: "/chimenea.png",
  "Pet friendly": "/pet.png",
  "Smoke detector": "/detector.png",
  "First aid kit": "/botiquin.png",
  Workspace: "/workspace.png",
  "Breakfast included": "/desayuno.png",
  "24h check-in": "/checking.png",
};

function HousingDetailsPage() {
  const params = useParams();
  const { isLoggedIn, openLoginModal, favorites, toggleFavorite } =
    useContext(AuthContext);

  const [acc, setAcc] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stars, setStars] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.accommodationId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await service.get(`/accommodation/${params.accommodationId}`);
        if (!cancelled) setAcc(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          if (err.response?.status === 404) {
            setError("Alojamiento no encontrado");
          } else if (err.response?.status === 400) {
            setError("La dirección del alojamiento no es válida");
          } else {
            setError("No se pudo cargar este alojamiento. Inténtalo más tarde.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.accommodationId]);

  useEffect(() => {
    if (!params.accommodationId) return;
    service
      .get(`/review/${params.accommodationId}`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setStars(res.data.avgStars || 0);
      })
      .catch((err) => console.error("Error al cargar reseñas:", err));
  }, [params.accommodationId]);

  const handleNewReview = (review) => {
    setReviews((prev) => [review, ...prev]);
    setShowForm(false);
  };

  const isFav = acc ? favorites.includes(acc._id) : false;
  const handleToggleFav = () => {
    if (!isLoggedIn) return openLoginModal();
    if (acc?._id) toggleFavorite(acc._id);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="warning">{error}</Alert>
      </Container>
    );
  }
  if (!acc) return null;

  const photos =
    Array.isArray(acc.photos) && acc.photos.length > 0
      ? acc.photos
      : ["/imagenpre.webp"];
  const mainImage = photos[0];
  const otherPhotos = [
    photos[1] || "/imagenpre.webp",
    photos[2] || "/imagenpre.webp",
    photos[3] || "/imagenpre.webp",
    photos[4] || "/imagenpre.webp",
  ];

  const ownerUsername = acc.owner?.username || "Anfitrión";
  const initial = ownerUsername.charAt(0).toUpperCase();
  const hasReviews = reviews.length > 0;

  return (
    <Container className="housing-details py-4">
      <Row className="align-items-center mb-3">
        <Col xs={9}>
          <h1 className="housing-details__title">{acc.title || "Alojamiento"}</h1>
          <div className="housing-details__meta">
            {hasReviews && (
              <>
                <span className="housing-details__rating">★ {stars.toFixed(1)}</span>
                <span className="dot">·</span>
                <span>
                  {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}
                </span>
                <span className="dot">·</span>
              </>
            )}
            {acc.city && <span>{acc.city}, España</span>}
          </div>
        </Col>
        <Col xs={3} className="text-end">
          <Button
            variant="link"
            onClick={handleToggleFav}
            aria-pressed={isFav}
            className="housing-details__fav-btn"
            title={isFav ? "Quitar de favoritos" : "Guardar"}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M12 21s-7-4.534-9.5-9.045C.79 8.523 2.5 4.5 6.5 4.5c2.063 0 3.514 1.16 4.5 2.5C12 5.66 13.437 4.5 15.5 4.5c4 0 5.71 4.023 4 7.455C19 16.466 12 21 12 21z"
                fill={isFav ? "#FF385C" : "rgba(0,0,0,0.45)"}
                stroke="#fff"
                strokeWidth="1.5"
              />
            </svg>
          </Button>
        </Col>
      </Row>

      <Row className="g-2 housing-details__gallery mb-4">
        <Col xs={12} lg={7}>
          <img
            src={mainImage}
            alt={acc.title}
            className="housing-details__main-img"
            loading="lazy"
          />
        </Col>
        <Col xs={12} lg={5}>
          <Row className="g-2 h-100">
            {otherPhotos.map((src, i) => (
              <Col xs={6} key={i}>
                <img
                  src={src}
                  alt={`${acc.title || "Alojamiento"} foto ${i + 2}`}
                  className="housing-details__thumb"
                  loading="lazy"
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2 className="h4">
                {acc.type} {acc.city ? `en ${acc.city}` : ""}
              </h2>
              <div className="text-muted">
                <strong>{acc.maxPeople ?? "?"}</strong> huéspedes ·{" "}
                <strong>{acc.bedrooms ?? "?"}</strong> dormitorios ·{" "}
                <strong>{acc.beds ?? "?"}</strong> camas ·{" "}
                <strong>{acc.bathrooms ?? "?"}</strong> baños
              </div>
            </div>
            <div className="housing-details__host">
              {acc.owner?.photo ? (
                <img
                  src={acc.owner.photo}
                  alt={ownerUsername}
                  className="housing-details__host-avatar"
                />
              ) : (
                <div className="housing-details__host-avatar housing-details__host-avatar--initial">
                  {initial}
                </div>
              )}
              <div className="small text-muted text-center">Anfitrión</div>
              <div className="small fw-semibold text-center">{ownerUsername}</div>
            </div>
          </div>

          <hr />

          {acc.description && (
            <>
              <p className="housing-details__description">{acc.description}</p>
              <hr />
            </>
          )}

          <h3 className="h5 mb-3">¿Qué ofrece este alojamiento?</h3>
          <div className="housing-details__services">
            {(acc.services ?? []).length === 0 && (
              <small className="text-muted">No hay servicios listados.</small>
            )}
            {(acc.services ?? []).map((s) => (
              <div key={s} className="housing-details__service" title={s}>
                {IMG_SERVICE[s] ? (
                  <img src={IMG_SERVICE[s]} alt="" aria-hidden />
                ) : (
                  <span className="housing-details__service-dot" aria-hidden>·</span>
                )}
                <span>{s}</span>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={5}>
          <div className="housing-details__booking-wrapper">
            <BookingCard accommodation={acc} />
          </div>
        </Col>
      </Row>

      <hr className="my-5" />

      {/* ¿Dónde me voy a quedar? */}
      <LocationBlock acc={acc} />

      <hr className="my-5" />

      {/* Sección de valoraciones estilo Airbnb */}
      <ReviewsBlock
        reviews={reviews}
        stars={stars}
        hasReviews={hasReviews}
        showForm={showForm}
        setShowForm={setShowForm}
        isLoggedIn={isLoggedIn}
        openLoginModal={openLoginModal}
        accommodationId={params.accommodationId}
        onNewReview={handleNewReview}
      />
    </Container>
  );
}

/* ============================================================
   Bloque "¿Dónde me voy a quedar?" con mapa
============================================================ */
function LocationBlock({ acc }) {
  const coords = acc?.location?.coordinates;
  // GeoJSON [lng, lat] → Leaflet [lat, lng]
  const center =
    Array.isArray(coords) && coords.length === 2
      ? [coords[1], coords[0]]
      : null;

  const cityLine = [acc?.city, "Comunidad de Madrid", "España"]
    .filter(Boolean)
    .join(", ");

  if (!center) {
    return (
      <section className="housing-location">
        <h2 className="h4 fw-bold mb-2">¿Dónde me voy a quedar?</h2>
        <p className="text-muted">
          {acc?.city ? `${acc.city}, España` : "Ubicación no disponible"}
        </p>
      </section>
    );
  }

  return (
    <section className="housing-location">
      <h2 className="h4 fw-bold mb-2">¿Dónde me voy a quedar?</h2>
      <p className="text-muted mb-3">{cityLine}</p>
      <div className="housing-location__map">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} icon={houseMarker} />
        </MapContainer>
      </div>
    </section>
  );
}

/* ============================================================
   Bloque de reseñas estilo Airbnb
============================================================ */
function ReviewsBlock({
  reviews,
  stars,
  hasReviews,
  showForm,
  setShowForm,
  isLoggedIn,
  openLoginModal,
  accommodationId,
  onNewReview,
}) {
  // Distribución de estrellas (5,4,3,2,1)
  const distribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0]; // index 0 = 5★
    reviews.forEach((r) => {
      const s = Math.round(r.stars || 0);
      if (s >= 1 && s <= 5) buckets[5 - s] += 1;
    });
    return buckets;
  }, [reviews]);

  const maxBucket = Math.max(...distribution, 1);
  const total = reviews.length;
  const avg = Number(stars) || 0;

  // Cuando no hay reseñas, formato compacto
  if (!hasReviews) {
    return (
      <section className="housing-reviews">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h2 className="h4 fw-bold mb-0">Reseñas</h2>
          {isLoggedIn ? (
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cerrar formulario" : "Escribir reseña"}
            </Button>
          ) : (
            <Button variant="outline-dark" size="sm" onClick={openLoginModal}>
              Inicia sesión para opinar
            </Button>
          )}
        </div>
        {showForm && (
          <ReviewForm
            accommodationId={accommodationId}
            onNewReview={onNewReview}
          />
        )}
        <p className="text-muted fst-italic">
          Aún no hay reseñas. ¡Sé el primero en opinar!
        </p>
      </section>
    );
  }

  // Mismas categorías que Airbnb. Como solo tenemos una nota global,
  // las mostramos todas con la nota media (sin inventar datos).
  const categories = [
    { name: "Limpieza", icon: CategoryIcons.cleaning },
    { name: "Veracidad", icon: CategoryIcons.accuracy },
    { name: "Llegada", icon: CategoryIcons.checkin },
    { name: "Comunicación", icon: CategoryIcons.comm },
    { name: "Ubicación", icon: CategoryIcons.location },
    { name: "Calidad", icon: CategoryIcons.value },
  ];

  return (
    <section className="housing-reviews">
      {/* Header */}
      <div className="housing-reviews__header">
        <h2 className="housing-reviews__score">
          <span className="housing-reviews__star">★</span>{" "}
          {avg.toFixed(2).replace(".", ",")}
          <span className="housing-reviews__sep"> · </span>
          {total} evaluaci{total === 1 ? "ón" : "ones"}
        </h2>
        <p className="text-muted small">¿Cómo funcionan las evaluaciones?</p>
      </div>

      {/* Distribución + categorías */}
      <div className="housing-reviews__stats">
        <div className="rating-distribution">
          <div className="small fw-semibold mb-2">Valoración general</div>
          {[5, 4, 3, 2, 1].map((s, i) => (
            <div className="rating-row" key={s}>
              <span className="rating-row__num">{s}</span>
              <div className="rating-row__bar">
                <div
                  className="rating-row__fill"
                  style={{ width: `${(distribution[i] / maxBucket) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {categories.map((c) => (
          <div className="rating-category" key={c.name}>
            <div className="rating-category__name">{c.name}</div>
            <div className="rating-category__score">
              {avg.toFixed(1).replace(".", ",")}
            </div>
            <div className="rating-category__icon" aria-hidden>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CTA reseña + formulario */}
      <div className="d-flex justify-content-end mb-3">
        {isLoggedIn ? (
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cerrar formulario" : "Escribir reseña"}
          </Button>
        ) : (
          <Button variant="outline-dark" size="sm" onClick={openLoginModal}>
            Inicia sesión para opinar
          </Button>
        )}
      </div>
      {showForm && (
        <ReviewForm
          accommodationId={accommodationId}
          onNewReview={onNewReview}
        />
      )}

      {/* Grid 2 columnas de reseñas */}
      <Row className="g-4 mt-2">
        {reviews.map((r) => (
          <Col xs={12} md={6} key={r._id}>
            <ReviewItem review={r} />
          </Col>
        ))}
      </Row>
    </section>
  );
}

/* Tarjeta individual de reseña — estilo Airbnb */
function ReviewItem({ review }) {
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE = 220;
  const text = review.text || "";
  const isLong = text.length > TRUNCATE;
  const shown = expanded || !isLong ? text : text.slice(0, TRUNCATE) + "…";

  const name =
    review.creator && typeof review.creator === "object"
      ? review.creator.username
      : review.creator || "Usuario";
  const photo =
    review.creator && typeof review.creator === "object"
      ? review.creator.photo
      : null;
  const initial = String(name || "U").charAt(0).toUpperCase();
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
    : "";
  const fullStars = Math.round(review.stars || 0);

  return (
    <article className="review-item">
      <header className="review-item__head">
        {photo ? (
          <img src={photo} alt={name} className="review-item__avatar" />
        ) : (
          <div className="review-item__avatar review-item__avatar--initial">
            {initial}
          </div>
        )}
        <div className="review-item__who">
          <div className="review-item__name">{name}</div>
          <div className="review-item__sub">Miembro de AirB2B</div>
        </div>
      </header>
      <div className="review-item__meta">
        <span className="review-item__stars" aria-label={`${fullStars} de 5`}>
          {"★".repeat(fullStars)}
          <span className="review-item__stars-empty">
            {"★".repeat(5 - fullStars)}
          </span>
        </span>
        {date && <span className="review-item__sep">·</span>}
        {date && <span>{date}</span>}
      </div>
      {review.title && <h6 className="review-item__title">{review.title}</h6>}
      <p className="review-item__text">{shown}</p>
      {isLong && (
        <button
          type="button"
          className="review-item__more"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </button>
      )}
    </article>
  );
}

/* Iconos line-style de las categorías de Airbnb */
const CategoryIcons = {
  cleaning: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h4l1 3h-4z" />
      <path d="M15 7v4a3 3 0 0 1-3 3H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" />
      <circle cx="8" cy="9" r="1" />
      <circle cx="6" cy="13" r="1" />
      <circle cx="10" cy="13" r="1" />
    </svg>
  ),
  accuracy: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  ),
  checkin: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8-8" />
      <path d="m15 4 4 4" />
      <path d="m18 7 2-2" />
    </svg>
  ),
  comm: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 1 1-3-6.2L21 4l-1 4a8 8 0 0 1 1 4z" />
      <path d="M8 11h8M8 14h5" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3z" />
      <path d="M9 4v13M15 7v13" />
    </svg>
  ),
  value: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12 12 4H4v8l8 8 8-8z" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  ),
};

export default HousingDetailsPage;
