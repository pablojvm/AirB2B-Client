import { useEffect, useState } from "react";
import service from "../services/service.config";
import { Card, Pagination, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Carousel4() {
  const navigate = useNavigate();

  const [acc, setAcc] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get(`/accommodation/favorites`);
      console.log("response.data:", response.data);
      setAcc(response.data.favorites);
    } catch (error) {
      console.log(error);
      navigate("/500");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h2>Tus Favoritos</h2>
        <Pagination>
          <Pagination.Prev />
          <Pagination.Next />
        </Pagination>
      </div>
      <Row>
        {acc.length === 0 ? (
          <Col>
            <p>Aún no tienes favoritos.</p>
          </Col>
        ) : (
          acc.map((eachAcc, idx) => (
            <Col key={idx} xl={6} className="mb-3">
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{eachAcc.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Card Subtitle
                  </Card.Subtitle>
                  <Card.Text>{eachAcc.description}</Card.Text>
                  <Card.Link href="#">Card Link</Card.Link>
                  <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}

export default Carousel4;
