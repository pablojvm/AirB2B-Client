import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <Container className="error-page text-center">
      <div className="error-page__icon" aria-hidden>
        🧭
      </div>
      <h1 className="error-page__code">404</h1>
      <p className="error-page__text">
        No encontramos la página que buscas. Puede que se haya mudado o que el
        enlace esté roto.
      </p>
      <Button as={Link} to="/" className="airb2b-btn-primary mt-2">
        Volver al inicio
      </Button>
    </Container>
  );
}

export default Page404;
