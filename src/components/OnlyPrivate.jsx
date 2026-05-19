import { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "../context/auth.context";

function OnlyPrivate({ children }) {
  const { isLoggedIn, openLoginModal, isValidatingToken } = useContext(AuthContext);

  useEffect(() => {
    if (!isValidatingToken && !isLoggedIn) {
      openLoginModal();
    }
  }, [isLoggedIn, isValidatingToken, openLoginModal]);

  if (isValidatingToken) return null;
  if (isLoggedIn) return children;

  return (
    <Container className="py-5 text-center">
      <h3 className="mb-2">Acceso restringido</h3>
      <p className="text-muted mb-0">Inicia sesión para ver esta sección.</p>
    </Container>
  );
}

export default OnlyPrivate;
