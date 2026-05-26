import { createContext, useEffect, useState, useCallback } from "react";
import service from "../services/service.config";
import ModalLogin from "../components/ModalLogin";

const AuthContext = createContext();

function AuthWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLoginModal = useCallback(() => setShowLoginModal(true), []);
  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);

  const [favorites, setFavorites] = useState([]);
  const [favoritesFull, setFavoritesFull] = useState([]);

  const authenticateUser = useCallback(async () => {
    const authToken = localStorage.getItem("authToken");

    // Mínimo 3s para que se vea siempre el splash de Airbnb al cargar la app.
    // Hacemos la petición y el delay en paralelo: el tiempo real de carga
    // queda enmascarado por el delay si la petición es rápida.
    const minSplash = new Promise((resolve) => setTimeout(resolve, 3000));

    if (!authToken) {
      await minSplash;
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
      return;
    }
    try {
      const [{ data }] = await Promise.all([
        service.get("/auth/verify"),
        minSplash,
      ]);
      setIsLoggedIn(true);
      setLoggedUserId(data.payload._id);
    } catch {
      await minSplash;
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setLoggedUserId(null);
    } finally {
      setIsValidatingToken(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const { data } = await service.get("/accommodation/favorites");
      if (!Array.isArray(data) || data.length === 0) {
        setFavorites([]);
        setFavoritesFull([]);
        return;
      }
      if (typeof data[0] === "object" && data[0]._id) {
        setFavorites(data.map((d) => d._id));
        setFavoritesFull(data);
        return;
      }
      // Si por algún motivo viniesen solo IDs, los hidratamos
      setFavorites(data);
      const results = await Promise.all(
        data.map((id) =>
          service
            .get(`/accommodation/${id}`)
            .then((r) => r.data)
            .catch(() => null)
        )
      );
      setFavoritesFull(results.filter(Boolean));
    } catch (err) {
      console.error("Error cargando favoritos:", err);
      setFavorites([]);
      setFavoritesFull([]);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (accId) => {
      if (!accId) return;
      const wasFav = favorites.includes(accId);

      // Optimistic update
      setFavorites((prev) =>
        wasFav ? prev.filter((id) => id !== accId) : [...prev, accId]
      );

      if (wasFav) {
        setFavoritesFull((prev) => prev.filter((a) => a._id !== accId));
      } else {
        try {
          const { data } = await service.get(`/accommodation/${accId}`);
          if (data?._id) {
            setFavoritesFull((prev) =>
              prev.some((a) => a._id === data._id) ? prev : [...prev, data]
            );
          }
        } catch (e) {
          console.warn("No se pudo cargar el alojamiento del favorito:", e);
        }
      }

      try {
        if (wasFav) {
          await service.delete(`/accommodation/favorites/${accId}`);
        } else {
          await service.post(`/accommodation/favorites/${accId}`);
        }
      } catch (err) {
        console.error("Error al togglear favorito:", err);
        setFavorites((prev) =>
          wasFav ? [...prev, accId] : prev.filter((id) => id !== accId)
        );
        loadFavorites();
      }
    },
    [favorites, loadFavorites]
  );

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  useEffect(() => {
    if (isLoggedIn) {
      loadFavorites();
    } else {
      setFavorites([]);
      setFavoritesFull([]);
    }
  }, [isLoggedIn, loadFavorites]);

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
    isValidatingToken,
  };

  if (isValidatingToken) {
    return (
      <div className="app-loading-screen">
        <img
          src="/airbnb.gif"
          alt="Cargando"
          className="app-loading-gif"
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {children}
      <ModalLogin show={showLoginModal} handleClose={closeLoginModal} />
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
