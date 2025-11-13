import { createContext, useEffect, useState } from "react";
import service from "../services/service.config";
import ModalLogin from "../components/ModalLogin";

const AuthContext = createContext();

function AuthWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  // ⚡ Estados de favoritos: IDs y objetos completos
  const [favorites, setFavorites] = useState([]); // array de IDs
  const [favoritesFull, setFavoritesFull] = useState([]); // array de objetos completos

  const authenticateUser = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await service.get("/auth/verify");
      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
      setIsValidatingToken(false);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
    }
  };

  // Cargar favoritos al loguearse
  useEffect(() => {
    if (isLoggedIn) loadFavorites();
    else {
      setFavorites([]);
      setFavoritesFull([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const loadFavorites = async () => {
    try {
      const res = await service.get("/accommodation/favorites");
      const data = res.data;

      // Caso 1: la API devuelve array de objetos completos
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0]._id) {
        const ids = data.map((d) => d._id);
        setFavorites(ids);
        setFavoritesFull(data);
        return;
      }

      // Caso 2: la API devuelve array de IDs (strings)
      if (Array.isArray(data) && data.length >= 0 && (data.length === 0 || typeof data[0] === "string")) {
        setFavorites(data);
        // Traer cada alojamiento por id para tener objetos completos
        if (data.length === 0) {
          setFavoritesFull([]);
          return;
        }
        const promises = data.map((id) => service.get(`/accommodation/${id}`).then(r => r.data).catch(() => null));
        const results = await Promise.all(promises);
        const valid = results.filter(Boolean);
        setFavoritesFull(valid);
        return;
      }

      // Caso fallback: no viene nada útil
      setFavorites([]);
      setFavoritesFull([]);
    } catch (err) {
      console.error("Error loadFavorites:", err);
      setFavorites([]);
      setFavoritesFull([]);
    }
  };

  // toggleFavorite actualiza IDs y objects completos
  const toggleFavorite = async (accId) => {
    try {
      const isFav = favorites.includes(accId);

      // actualización optimista IDs
      setFavorites((prev) => (isFav ? prev.filter((id) => id !== accId) : [...prev, accId]));

      // actualización optimista objetos completos
      if (isFav) {
        setFavoritesFull((prev) => prev.filter((a) => a._id !== accId));
      } else {
        // intentamos traer el objeto completo y añadirlo
        try {
          const res = await service.get(`/accommodation/${accId}`);
          if (res?.data) {
            setFavoritesFull((prev) => [...prev, res.data]);
          }
        } catch (errFetch) {
          // si falla al traer el objeto, no rompemos — el ID ya está añadido
          console.warn("No se pudo traer alojamiento completo tras añadir favorito:", errFetch);
        }
      }

      // llamada al backend
      if (isFav) {
        await service.delete(`/accommodation/favorites/${accId}`);
      } else {
        await service.post(`/accommodation/favorites/${accId}`);
      }
    } catch (err) {
      console.error("Error toggleFavorite:", err);
      // revertir cambios optimistas si algo falla
      setFavorites((prev) => (prev.includes(accId) ? prev.filter((id) => id !== accId) : [...prev, accId]));
      setFavoritesFull((prev) => (prev.some(a => a._id === accId) ? prev.filter(a => a._id !== accId) : [...prev]));
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const passedContext = {
    isLoggedIn,
    loggedUserId,
    authenticateUser,
    showLoginModal,
    openLoginModal,
    closeLoginModal,
    favorites,      // IDs
    favoritesFull,  // objetos completos
    toggleFavorite, // para añadir/quitar
  };

  if (isValidatingToken) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#ffffff" }}>
        <img src="/airbnb.gif" alt="loading" style={{ width: "450px", height: "450px", objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
      <ModalLogin show={showLoginModal} handleClose={closeLoginModal} />
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
