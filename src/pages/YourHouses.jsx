import { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import service from "../services/service.config";

function YourHouses() {
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get(`/accommodation/own`);
      setHouses(response.data);
    } catch (error) {
      console.log(error);
      navigate("/500");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Tus alojamientos</h1>
      <Row className="g-4 justify-content-start">
        {houses.map((eachAcc, idx) => (
          <Col key={eachAcc._id || idx} xs={12} sm={6} md={4} lg={3} xl={2}>
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
            </Card>
            <div>
              <h7>{eachAcc.title}</h7>
              <p>{(eachAcc.cost ?? 0) * 2}€ por dos noches</p>
            </div>
          </Col>
        ))}
        {houses.length === 0 && (
          <div className="text-center mt-4">
            <Button as={Link} to="/newHouse" variant="outline-dark">
              <img src="/casa.png" width="100px" alt="Nueva casa" />
              <p>Publica un anuncio</p>
            </Button>
            <h4 className="mt-3">Aún no has publicado tus alojamientos</h4>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default YourHouses;
