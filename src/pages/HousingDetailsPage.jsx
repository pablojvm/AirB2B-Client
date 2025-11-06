import service from "../services/service.config";
import { useEffect, useState, useContext } from "react";
import { Button, Image, Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import BookingCard from "../components/BookingCard";
import ReviewForm from "../components/ReviewForm";

function HousingDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);

  const [acc, setAcc] = useState(null);
  const [fav, setFav] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const imagesServices = {
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

  useEffect(() => {
    if (!params.accommodationId) return;
    getData();
  }, [params.accommodationId]);

  const getData = async () => {
    try {
      const response = await service.get(
        `/accommodation/${params.accommodationId}`
      );
      setAcc(response.data);
    } catch (error) {
      console.log(error);
      navigate("/500");
    }
  };

  useEffect(() => {
    if (isLoggedIn && params.accommodationId) {
      infoFavorites();
    } else {
      setFav([]);
    }
  }, [isLoggedIn, params.accommodationId]);

  useEffect(() => {
    if (!acc?._id) {
      setIsFav(false);
      return;
    }
    setIsFav(fav.includes(acc._id));
  }, [acc, fav]);

  const infoFavorites = async () => {
    try {
      const response = await service.get("/accommodation/favorites");
      const ids = Array.isArray(response.data)
        ? response.data.map((f) => f._id)
        : [];
      setFav(ids);
    } catch (error) {
      console.log("Error al obtener favoritos:", error);
      const status = error.response?.status;
      if (status === 401) {
        setFav([]);
      } else if (status !== 403) {
        navigate("/500");
      }
    }
  };

  const handleToggleFav = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para guardar favoritos");
      return;
    }
    if (!acc?._id) return;

    try {
      if (!fav.includes(acc._id)) {
        await service.post(`/accommodation/favorites/${acc._id}`);
        setFav((prev) => [...prev, acc._id]);
        setIsFav(true);
      } else {
        await service.delete(`/accommodation/favorites/${acc._id}`);
        setFav((prev) => prev.filter((id) => id !== acc._id));
        setIsFav(false);
      }
    } catch (error) {
      console.log("Error al togglear favorito:", error);
      if (error.response?.status === 401) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      } else {
        alert(error.response?.data?.message || "Error al actualizar favoritos");
      }
    }
  };

  // Cargar reseñas
  useEffect(() => {
    if (!params.accommodationId) return;
    service
      .get(`/review/${params.accommodationId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.log("Error al cargar reseñas:", err));
  }, [params.accommodationId]);

  const handleNewReview = (review) => {
    setReviews((prev) => [review, ...prev]);
  };

  if (!acc)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <img src="/animatedviolin.gif" alt="loading" />
      </div>
    );

  const mainImage = acc.photos?.[0] ?? "/imagenpre.webp";
  const otherPhotos = [
    acc.photos?.[1] ?? "/imagenpre.webp",
    acc.photos?.[2] ?? "/imagenpre.webp",
    acc.photos?.[3] ?? "/imagenpre.webp",
    acc.photos?.[4] ?? "/imagenpre.webp",
  ];

  const initial = acc.owner.username
    ? acc.owner.username.charAt(0).toUpperCase()
    : "?";

  return (
    <Container className="mt-4">
      {/* Cabecera y favorito */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={9}>
          <h3>{acc.title}</h3>
          <div style={{ color: "#777" }}>
            <small>
              {acc.type} · {acc.city}
            </small>
          </div>
        </Col>
        <Col xs={12} md={3} className="text-md-end mt-2 mt-md-0">
          <Button
            variant="link"
            onClick={handleToggleFav}
            aria-pressed={isFav}
            style={{ textDecoration: "none", padding: 6 }}
            title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <img
              src={isFav ? "/corazon-rojo.png" : "/corazon.png"}
              alt={isFav ? "Favorito" : "No favorito"}
              style={{ width: 50, height: 50 }}
            />
          </Button>
        </Col>
      </Row>

      {/* Imágenes */}
      <Row className="mb-4">
        <Col xs={12} lg={7}>
          <Image
            src={mainImage}
            alt={acc.title}
            fluid
            style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 12 }}
            loading="lazy"
          />
        </Col>
        <Col xs={12} lg={5}>
          <Row className="g-2">
            {otherPhotos.map((src, i) => (
              <Col xs={6} key={i}>
                <Image
                  src={src}
                  alt={`${acc.title} foto ${i + 2}`}
                  fluid
                  rounded
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                  loading="lazy"
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Info y servicios */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <Row className="mb-3" style={{ display: "flex", flexDirection: "column" }}>
            <Col xs={12} md={8}>
              <h5>Descripción</h5>
              <p style={{ whiteSpace: "pre-wrap" }}>{acc.description}</p>
            </Col>
            <Col xs={12} md={4}>
              <div className="d-flex align-items-center mb-3">
                {acc.owner.photo ? (
          <img
            src={acc.owner.photo}
            alt="Foto de perfil"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "24px",
              lineHeight: "60px",
              textAlign: "center",
              margin: "0 auto",
            }}
            aria-hidden
          >
            {initial}
          </div>
        )}
                <div>
                  <div style={{ fontWeight: 600 }}>{acc.owner?.username}</div>
                  <small style={{ color: "#666" }}>Anfitrión</small>
                </div>
              </div>

              <div>
                <div style={{ marginBottom: 8 }}>
                  <strong>
                    {acc.bedrooms} dormitorios · {acc.beds} camas · {acc.bathrooms} baños
                  </strong>
                </div>
                <Badge bg="warning" text="dark">
                  ☆ {acc.stars ?? "—"}
                </Badge>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h4>¿Que ofrece este alojamiento?</h4>
              <div className="d-flex flex-wrap gap-3">
                {(acc.services ?? []).length === 0 && <small>No hay servicios listados.</small>}
                {(acc.services ?? []).map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 12,
                      background: "#f7f7f7",
                    }}
                    title={s}
                  >
                    {imagesServices[s] ? (
                      <img
                        src={imagesServices[s]}
                        alt={s}
                        style={{ width: 36, height: 36, objectFit: "contain" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          backgroundColor: "#000",
                          color: "#fff",
                          fontSize: "16px",
                          lineHeight: "36px",
                          textAlign: "center",
                        }}
                        aria-hidden
                      >
                        ?
                      </div>
                    )}
                    <small style={{ fontWeight: 600 }}>{s}</small>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ width: 320 }}>
          <BookingCard accommodation={acc} onBooked={(r) => console.log(r)} />
        </div>
      </div>

      {/* Reseñas */}
      <div className="mt-4">
        <h2>Reseñas</h2>

        {loggedUserId ? (
          <div className="mb-3">
            <button className="btn btn-secondary" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? "Cerrar formulario" : "Escribir reseña"}
            </button>
          </div>
        ) : (
          <p>Inicia sesión para escribir una reseña</p>
        )}

        {showForm && (
          <ReviewForm
            accommodationId={params.accommodationId}
            onNewReview={handleNewReview}
          />
        )}

        {reviews.map((r) => (
          <div key={r._id} className="card mb-2 p-2">
            <strong>{r.creator?.username ?? "Usuario"}</strong> - {r.stars} ⭐
            <h6>{r.title}</h6>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default HousingDetailsPage;