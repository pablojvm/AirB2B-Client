import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from '../services/service.config';
import { Card, Pagination, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';

function Carousel3() {
  const navigate = useNavigate();

  const [acc, setAcc] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const pageSize = 6;            // tarjetas visibles
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  // reinicia ventana al cambiar datos
  useEffect(() => {
    setStartIndex(0);
  }, [acc]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await service.get(`/accommodation/randomCity`);
      // aquí extraemos city y el array de alojamientos
      setAcc(response.data.accommodations ?? []);
      setCity(response.data.city ?? '');
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

  const handlePrev = () => setStartIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setStartIndex(prev => Math.min(maxStart, prev + 1));

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
        <h2>Alojamientos en {city || '...'}</h2>

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
              <Card
                className="border-0"
                style={{ width: "18rem", textDecoration:"none"  }}
                as={Link}
                to={`/housingdetails/${eachAcc._id}`}
              >
                <Card.Img
                  src={eachAcc.photos[0]}
                  alt="Alojamiento"
                  className="border-1 img-fluid rounded-1"
                  style={{
                    width: "100%",
                    maxWidth: "350px",
                    height: "auto",
                    objectFit: "cover",
                    border:"2px solid black",
                    borderRadius:"20px"
                  }}
                />

                <Card.Body>
                  <Card.Title>{eachAcc.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {eachAcc.cost}€
                  </Card.Subtitle>
                  <Card.Text>{eachAcc.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Carousel3;
