// src/components/OnlyPrivate.jsx
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

function OnlyPrivate({ children }) {
  const { isLoggedIn, openLoginModal } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal();
    }
    // Nota: no cerramos el modal desde aquí; lo cierra ModalLogin al hacer login
  }, [isLoggedIn, openLoginModal]);

  if (isLoggedIn) {
    return children;
  } else {
    // Devolvemos null porque el modal abre por efecto secundario
    return null;
  }
}

export default OnlyPrivate;
