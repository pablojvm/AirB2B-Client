import { useContext } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import HousingCard from "../components/HousingCard";
import EmptyState, { HeartIcon } from "../components/EmptyState";

function FavoritesHousingPage() {
  const { favoritesFull = [] } = useContext(AuthContext);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
        <div>
          <h1 className="page-title mb-0">Tus favoritos</h1>
          <p className="text-muted mb-0">
            {favoritesFull.length} alojamiento
            {favoritesFull.length !== 1 ? "s" : ""} guardado
            {favoritesFull.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button as={Link} to="/" variant="outline-dark" size="sm">
          Explorar más
        </Button>
      </div>

      {favoritesFull.length === 0 ? (
        <EmptyState
          icon={HeartIcon}
          title="Aún no tienes favoritos"
          text="Pulsa el corazón en cualquier alojamiento para guardarlo y volver más tarde."
          action={
            <Button as={Link} to="/" className="airb2b-btn-primary">
              Descubrir alojamientos
            </Button>
          }
        />
      ) : (
        <Row className="g-4">
          {favoritesFull.map((acc) => (
            <Col key={acc._id} xs={12} sm={6} md={4} lg={3}>
              <HousingCard acc={acc} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default FavoritesHousingPage;
