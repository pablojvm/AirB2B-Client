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

  const [favorites, setFavorites] = useState([]);
  const [favoritesFull, setFavoritesFull] = useState([]);

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

  useEffect(() => {
    if (isLoggedIn) loadFavorites();
    else {
      setFavorites([]);
      setFavoritesFull([]);
    }
  }, [isLoggedIn]);

  const loadFavorites = async () => {
    try {
      const res = await service.get("/accommodation/favorites");
      const data = res.data;

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        typeof data[0] === "object" &&
        data[0]._id
      ) {
        const ids = data.map((d) => d._id);
        setFavorites(ids);
        setFavoritesFull(data);
        return;
      }
      if (
        Array.isArray(data) &&
        data.length >= 0 &&
        (data.length === 0 || typeof data[0] === "string")
      ) {
        setFavorites(data);
        if (data.length === 0) {
          setFavoritesFull([]);
          return;
        }
        const promises = data.map((id) =>
          service
            .get(`/accommodation/${id}`)
            .then((r) => r.data)
            .catch(() => null)
        );
        const results = await Promise.all(promises);
        const valid = results.filter(Boolean);
        setFavoritesFull(valid);
        return;
      }
      setFavorites([]);
      setFavoritesFull([]);
    } catch (err) {
      console.error("Error loadFavorites:", err);
      setFavorites([]);
      setFavoritesFull([]);
    }
  };

  const toggleFavorite = async (accId) => {
    try {
      const isFav = favorites.includes(accId);

      setFavorites((prev) =>
        isFav ? prev.filter((id) => id !== accId) : [...prev, accId]
      );

      if (isFav) {
        setFavoritesFull((prev) => prev.filter((a) => a._id !== accId));
      } else {
        try {
          const res = await service.get(`/accommodation/${accId}`);
          if (res?.data) {
            setFavoritesFull((prev) => [...prev, res.data]);
          }
        } catch (errFetch) {
          console.warn(
            "No se pudo traer alojamiento completo tras añadir favorito:",
            errFetch
          );
        }
      }
      if (isFav) {
        await service.delete(`/accommodation/favorites/${accId}`);
      } else {
        await service.post(`/accommodation/favorites/${accId}`);
      }
    } catch (err) {
      console.error("Error toggleFavorite:", err);
      setFavorites((prev) =>
        prev.includes(accId)
          ? prev.filter((id) => id !== accId)
          : [...prev, accId]
      );
      setFavoritesFull((prev) =>
        prev.some((a) => a._id === accId)
          ? prev.filter((a) => a._id !== accId)
          : [...prev]
      );
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
    favorites,
    favoritesFull,
    toggleFavorite,
  };

  if (isValidatingToken) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        <img
          src="/airbnb.gif"
          alt="loading"
          style={{ width: "450px", height: "450px", objectFit: "cover" }}
        />
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
