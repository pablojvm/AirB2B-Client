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

  const authenticateUser = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      // 🔄 Simulamos un retardo de carga (3 segundos)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
      return;
    }

    try {
      // 🔄 Simulamos retardo también al validar el token
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await service.get("/auth/verify");

      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
      setIsValidatingToken(false);
    } catch (error) {
      // 🔄 Retardo también si hay error
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
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
          style={{
            width: "450px",
            height: "450px",
            objectFit: "cover",
          }}
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
