import service from '../services/service.config';
import { useEffect, useState } from 'react';
import { Card, Pagination, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

function Carousel3() {

  const navigate = useNavigate()

  const [acc, setAcc] = useState([]);


  useEffect(() => {
      getData();
    }, []);

  const getData = async () => {
    try {
      const response = await service.get(`/accommodation/randomCity`);
      setAcc(response.data.accommodations);
    } catch (error) {
      console.log(error);
      navigate("/500");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h2>Alojamientos en {acc[0].city}</h2>
        <Pagination>
          <Pagination.Prev />
          <Pagination.Next />
        </Pagination>
      </div>
      <Row>
        {acc.map((eachAcc, idx) => (
          <Col key={idx} xl={6} className="mb-3">
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{eachAcc.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {eachAcc.cost}€
              </Card.Subtitle>
              <Card.Text>
                {eachAcc.description}
              </Card.Text>
              <Card.Link href="#">Card Link</Card.Link>
              <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
          </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Carousel3
