import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from '../services/service.config';
import { Card, Pagination, Row, Col } from 'react-bootstrap'

function Carousel2() {

  const navigate = useNavigate()

  const [acc, setAcc] = useState([]);


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get(`/accommodation/byRating`);
      setAcc(response.data);
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
        <h2>Alojamientos mejor valorados</h2>
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

export default Carousel2
