import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Page500() {
  return (
    <Container className="error-page text-center">
      <div className="error-page__icon" aria-hidden>
        🛠
      </div>
      <h1 className="error-page__code text-danger">500</h1>
      <p className="error-page__text">
        Algo salió mal en nuestros servidores. Estamos trabajando en arreglarlo.
      </p>
      <Button as={Link} to="/" className="airb2b-btn-primary mt-2">
        Volver al inicio
      </Button>
    </Container>
  );
}

export default Page500;
