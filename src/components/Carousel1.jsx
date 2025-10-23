import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from "../services/service.config";
import { Card, Pagination, Row, Col, Alert, Spinner, Button } from "react-bootstrap";

function Carousel1() {
  const navigate = useNavigate();

  const [acc, setAcc] = useState([]);
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
      const response = await service.get(`/accommodation/popular`);
      setAcc(response.data ?? []);
    } catch (error) {
      console.log(error);
      navigate("/500");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = 12;
  const maxStart = Math.max(0, totalItems - pageSize);
  const visible = acc.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStart, prev + 1));
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Alojamientos mas populares</h2>

        <Pagination>
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
        <Row>
          {visible.map((eachAcc, idx) => (
            <Col key={eachAcc._id ?? startIndex + idx} xl={2} className="mb-3">
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{eachAcc.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {eachAcc.cost}€
                  </Card.Subtitle>
                  <Card.Text>{eachAcc.description}</Card.Text>
                  <Button variant="outline-primary" size="sm" as={Link} to={`/housingdetails/${eachAcc._id}`} >
                    + Info
                  </Button>
                  <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Carousel1;
