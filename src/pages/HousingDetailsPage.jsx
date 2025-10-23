import service from "../services/service.config";
import { useEffect, useState, useContext } from "react";
import { Button, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function HousingDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext); // Add this

  const [acc, setAcc] = useState(null);
  const [isFav, setIsFav] = useState([]);

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
    setIsFav(!isFav); // alterna entre true/false
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

  if (!acc) return <img src="/animatedviolin.gif" alt="loading" />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <h3>{acc.title}</h3>
        <Button
          variant="outline-danger"
          onClick={handleToggleFav}
          style={{ marginLeft: "5px" }}
        >
          <img
            src={isFav ? "/corazon.png" : "/corazon-rojo.png"}
            style={{ width: "30px" }}
            alt="favorito"
          />
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Image src={acc.photos[0] || "/imagenpre.webp"} width="500px" />
        <div>
          <div>
            <Image src={acc.photos[1] || "/imagenpre.webp"} width="250px" />
            <Image src={acc.photos[2] || "/imagenpre.webp"} width="250px" />
          </div>
          <div>
            <Image src={acc.photos[3] || "/imagenpre.webp"} width="250px" />
            <Image src={acc.photos[4] || "/imagenpre.webp"} width="250px" />
          </div>
        </div>
      </div>
      <div>
        <h4>{acc.type} en: {acc.city}</h4>
        <p>{acc.bedrooms} dormitorios · {acc.beds} camas · {acc.bathrooms} baños</p>
        <p>☆{acc.stars}</p>
        <hr/>
        <Image src={acc.owner.photo} width="50px"/>
        <h5>Anfitrión: {acc.owner.username}</h5>
      </div>
    </div>
  );
}

export default HousingDetailsPage;
