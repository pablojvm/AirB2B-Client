import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from "../services/service.config";
import {
  Card,
  Pagination,
  Row,
  Col,
  Spinner,
  Alert,
  Container,
  Button,
} from "react-bootstrap";
import { AuthContext } from "../context/auth.context";

function Carousel3({ setShowLoginModal }) {
  const navigate = useNavigate();
  const {
    favorites = [],
    toggleFavorite,
    isLoggedIn,
  } = useContext(AuthContext);

  const [acc, setAcc] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 6;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [acc]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await service.get(`/accommodation/randomCity`);

      if (Array.isArray(response.data?.accommodations)) {
        setAcc(response.data.accommodations);
        setCity(response.data.city ?? "");
      } else if (Array.isArray(response.data)) {
        setAcc(response.data);
        setCity("");
      } else {
        setAcc([]);
        setCity("");
      }
    } catch (error) {
      console.error("Error cargando alojamientos:", error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = Array.isArray(acc) ? acc.length : 0;
  const maxStart = Math.max(0, totalItems - pageSize);
  const visible = Array.isArray(acc)
    ? acc.slice(startIndex, startIndex + pageSize)
    : [];

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setStartIndex((prev) => Math.min(maxStart, prev + 1));

  return (
    <Container className="mt-4">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Alojamientos en {city || "..."}</h2>
        <Pagination className="m-0">
          <Pagination.Prev onClick={handlePrev} disabled={startIndex === 0} />
          <Pagination.Next
            onClick={handleNext}
            disabled={startIndex >= maxStart}
          />
        </Pagination>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
          <Spinner animation="border" role="status" />
        </div>
      ) : totalItems === 0 ? (
        <Alert variant="info">No hay alojamientos para mostrar.</Alert>
      ) : (
        <Row className="g-4 justify-content-start">
          {visible.map((eachAcc, idx) => {
            const isFav = favorites.includes(eachAcc._id);
            return (
              <Col
                key={eachAcc._id ?? startIndex + idx}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
              >
                <Card
                  as={Link}
                  to={`/housingdetails/${eachAcc._id}`}
                  style={{
                    textDecoration: "none",
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Card.Img
                    src={eachAcc.photos?.[0] || "/placeholder.png"}
                    alt="Alojamiento"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.ImgOverlay>
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isLoggedIn) {
                          setShowLoginModal(true);
                          return;
                        }
                        toggleFavorite(eachAcc._id);
                      }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "transparent",
                        border: "none",
                      }}
                    >
                      <img
                        src={isFav ? "/corazon-rojo.png" : "/corazon.png"}
                        alt="Fav"
                        style={{ width: 40, height: 40 }}
                      />
                    </Button>
                  </Card.ImgOverlay>
                </Card>
                <div>
                  <h7>{eachAcc.title}</h7>
                  <p>{(eachAcc.cost ?? 0) * 2}€ por dos noches</p>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default Carousel3;
