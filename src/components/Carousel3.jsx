import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from "../services/service.config";
import { Card, Pagination, Row, Col, Spinner, Alert, Container } from "react-bootstrap";

function Carousel3() {
  const navigate = useNavigate();

  const [acc, setAcc] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 6
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
      setAcc(response.data?.accommodations ?? []);
      setCity(response.data?.city ?? "");
    } catch (error) {
      console.log(error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = acc.length;
  const maxStart = Math.max(0, totalItems - pageSize);
  const visible = acc.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - pageSize));
  const handleNext = () => setStartIndex((prev) => Math.min(maxStart, prev + pageSize));

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
          <Pagination.Next onClick={handleNext} disabled={startIndex >= maxStart} />
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
          {visible.map((eachAcc, idx) => (
            <Col key={eachAcc._id ?? startIndex + idx} xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card
                className="border-0 shadow-sm h-100"
                as={Link}
                to={`/housingdetails/${eachAcc._id}`}
                style={{
                  textDecoration: "none",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <Card.Img
                  src={eachAcc.photos?.[0] || "/placeholder.png"}
                  alt="Alojamiento"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />

                <Card.Body className="text-center d-flex flex-column">
                  <div style={{ flex: 1 }}>
                    <Card.Title style={{ fontSize: "1rem" }}>{eachAcc.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{eachAcc.cost}€</Card.Subtitle>
                  </div>
                  <Card.Text
                    style={{
                      fontSize: "0.85rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {eachAcc.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Carousel3;
