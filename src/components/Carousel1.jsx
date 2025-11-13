import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from "../services/service.config";
import {
  Card,
  Pagination,
  Row,
  Col,
  Spinner,
  Container,
  Button,
} from "react-bootstrap";
import { AuthContext } from "../context/auth.context";

function Carousel1({ setShowLoginModal }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isLoggedIn } = useContext(AuthContext);

  const [acc, setAcc] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 6;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => setStartIndex(0), [acc]);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await service.get("/accommodation/popular");
      setAcc(res.data ?? []);
    } catch (err) {
      console.log(err);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = acc.length;
  const maxStart = Math.max(0, totalItems - pageSize);
  const visible = acc.slice(startIndex, startIndex + pageSize);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Alojamientos más populares</h2>
        <Pagination className="m-0">
          <Pagination.Prev
            onClick={() => setStartIndex((prev) => Math.max(0, prev - 1))}
            disabled={startIndex === 0}
          />
          <Pagination.Next
            onClick={() =>
              setStartIndex((prev) => Math.min(maxStart, prev + 1))
            }
            disabled={startIndex >= maxStart}
          />
        </Pagination>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center p-3">
          <Spinner animation="border" />
        </div>
      ) : totalItems === 0 ? (
        <p>No hay alojamientos para mostrar.</p>
      ) : (
        <Row className="g-4">
          {visible.map((eachAcc) => {
            const isFavItem = favorites.includes(eachAcc._id);
            return (
              <Col key={eachAcc._id} xs={12} sm={6} md={4} lg={3} xl={2}>
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
                        src={isFavItem ? "/corazon-rojo.png" : "/corazon.png"}
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

export default Carousel1;
