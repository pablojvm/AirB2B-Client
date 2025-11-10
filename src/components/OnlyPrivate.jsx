// src/components/OnlyPrivate.jsx
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

function OnlyPrivate({ children }) {
  const { isLoggedIn, openLoginModal } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal();
    }
  }, [isLoggedIn, openLoginModal]);

  if (isLoggedIn) {
    return children;
  } else {
    return null;
  }
}

export default OnlyPrivate;
