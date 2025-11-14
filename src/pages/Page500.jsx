import { Container, Button, Row, Col, Image } from "react-bootstrap";

function Page500() {
  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "100vh", backgroundColor: "#f7f7f7" }}
    >
      <Row>
        <Col>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
            alt="Server Error"
            style={{ width: "170px", opacity: 0.8 }}
            className="mb-4"
            rounded
          />

          <h1 className="display-3 fw-bold text-danger mb-3">500</h1>
          <p className="fs-4 text-muted mb-4 max-w-50 mx-auto">
            Algo salió mal en nuestros servidores. No te preocupes, nuestro
            equipo ya está trabajando para solucionarlo.
          </p>

          <Button
            variant="danger"
            href="/"
            size="lg"
            className="px-4 py-2 rounded-3 shadow-sm"
          >
            Volver al inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Page500;
