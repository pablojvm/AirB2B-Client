import service from "../services/service.config";
import { useEffect, useState, useContext } from "react";
import { Button, Image, Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import BookingCard from "../components/BookingCard";

function HousingDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const [acc, setAcc] = useState(null);
  const [isFav, setIsFav] = useState(false); // booleano: true = favorito

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
      // si quieres inicializar el estado de favorito desde los datos:
      // setIsFav(response.data.isFavorite ?? false);
    } catch (error) {
      console.log(error);
      navigate("/500");
    }
  };

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

  //   useEffect(() => {
  //     if (isLoggedIn && params.accommodationId) {
  //       infoFavorites();
  //     }
  //   }, [isLoggedIn, params.accommodationId]);

  //   const infoFavorites = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await service.get('/accommodation/favorites', {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     setFav(response.data.map(favAcc => favAcc._id));
  //   } catch (error) {
  //     console.log("Error al obtener favoritos:", error);
  //     if (error.response?.status === 401) {
  //     } else if (error.response?.status !== 403) {
  //       navigate("/500");
  //     }
  //   }
  // };

  const handleToggleFav = () => {
    // estado local (ui only). La lógica real con llamadas al backend la dejaste comentada arriba.
    setIsFav((prev) => !prev);
  };

  //   const handleToggleFav = async () => {
  //     // Check if user is logged in before attempting
  //     if (!isLoggedIn) {
  //       alert("Debes iniciar sesión para guardar favoritos");
  //       return;
  //     }

  //     try {
  //       if (!fav.includes(acc._id)) {
  //         await service.post(`/accommodation/favorites/${acc._id}`);
  //         setFav(prev => [...prev, acc._id]);
  //       } else {
  //         await service.delete(`/accommodation/favorites/${acc._id}`);
  //         setFav(prev => prev.filter(id => id !== acc._id));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       if (error.response?.status === 401) {
  //         alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
  //       }
  //     }
  //   };

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

  const ownerPhoto =
    acc.owner?.photo ||
    "https://res.cloudinary.com/dinaognbb/image/upload/v1761645190/imagenpre_uq6mvm.webp";

  return (
    <Container className="mt-4">
      {/* Cabecera: título + favorito */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={9}>
          <h3 style={{ margin: 0 }}>{acc.title}</h3>
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
              style={{ width: 30, height: 30 }}
            />
          </Button>
        </Col>
      </Row>

      {/* Imágenes */}
      <Row className="mb-4">
        <Col xs={12} lg={7}>
          <figure style={{ margin: 0 }}>
            <Image
              src={mainImage}
              alt={acc.title}
              fluid
              style={{
                width: "100%",
                height: 420,
                objectFit: "cover",
                borderRadius: 12,
              }}
              loading="lazy"
            />
          </figure>
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

      <div style={{display:"flex", }}>
        <div>
          {/* Info principal */}
          <Row className="mb-3" style={{display:"flex", flexDirection:"column"}}>
            <Col xs={12} md={8}>
              <h5>Descripción</h5>
              <p style={{ whiteSpace: "pre-wrap" }}>{acc.description}</p>
            </Col>

            <Col xs={12} md={4}>
              <div className="d-flex align-items-center mb-3">
                <Image
                  src={ownerPhoto}
                  alt={`Anfitrión ${acc.owner?.username ?? ""}`}
                  roundedCircle
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    marginRight: 12,
                  }}
                  loading="lazy"
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{acc.owner?.username}</div>
                  <small style={{ color: "#666" }}>Anfitrión</small>
                </div>
              </div>

              <div>
                <div style={{ marginBottom: 8 }}>
                  <strong>
                    {acc.bedrooms} dormitorios · {acc.beds} camas ·{" "}
                    {acc.bathrooms} baños
                  </strong>
                </div>
                <div>
                  <Badge bg="warning" text="dark">
                    ☆ {acc.stars ?? "—"}
                  </Badge>
                </div>
              </div>
            </Col>
          </Row>

          {/* Servicios */}
          <Row className="mb-4">
            <Col>
              <h4>¿Qué hay en este alojamiento?</h4>
              <div className="d-flex flex-wrap gap-3">
                {(acc.services ?? []).length === 0 && (
                  <small>No hay servicios listados.</small>
                )}
                {(acc.services ?? []).map((eachService) => (
                  <div
                    key={eachService}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 12,
                      background: "#f7f7f7",
                    }}
                    title={eachService}
                  >
                    <img
                      src={imagesServices[eachService] ?? "/checking.png"}
                      alt={eachService}
                      style={{ width: 36, height: 36, objectFit: "contain" }}
                    />
                    <small style={{ fontWeight: 600 }}>{eachService}</small>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <BookingCard
            accommodation={{
              _id: "123",
              title: "Apartamento centro",
              cost: 45,
            }}
            onBooked={(r) => console.log(r)}
          />
        </div>
      </div>
    </Container>
  );
}

export default HousingDetailsPage;
