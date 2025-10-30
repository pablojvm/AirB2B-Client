import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
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
    <div>
      <h1 className="mb-4">Tus anuncios</h1>
      <Row>
        {houses.map((eachAcc, idx) => (
          <Col key={eachAcc._id || idx} xl={2} className="mb-3">
            <Card
              className="border-0"
              style={{ width: "18rem", textDecoration: "none" }}
              as={Link}
              to={`/housingdetails/${eachAcc._id}`}
            >
              <Card.Img
                src={eachAcc.photos[0]}
                alt="Alojamiento"
                style={{
                  width: "100%",
                  maxWidth: "350px",
                  height: "auto",
                  objectFit: "cover",
                  border: "2px solid black",
                  borderRadius: "20px",
                }}
              />
              <Card.Body>
                <Card.Title>{eachAcc.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  €{eachAcc.cost}
                </Card.Subtitle>
                <Card.Text>{eachAcc.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default YourHouses;
