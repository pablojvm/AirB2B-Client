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

      <div className="housing-details__reviews">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">
            {hasReviews ? (
              <>
                <span className="housing-details__rating">★ {stars.toFixed(1)}</span>{" "}
                · {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}
              </>
            ) : (
              "Reseñas"
            )}
          </h2>
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
            accommodationId={params.accommodationId}
            onNewReview={handleNewReview}
          />
        )}

        {!hasReviews ? (
          <p className="text-muted fst-italic">
            Aún no hay reseñas. ¡Sé el primero en opinar!
          </p>
        ) : (
          <div className="reviews-list">
            {reviews.map((r) => (
              <div key={r._id} className="card mb-2 p-3 shadow-sm border-0">
                <strong>
                  {r.creator && typeof r.creator === "object"
                    ? r.creator.username
                    : r.creator || "Usuario"}
                </strong>{" "}
                - {r.stars} ⭐
                <h6 className="mt-2 mb-1">{r.title}</h6>
                <p className="mb-0">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default HousingDetailsPage;
