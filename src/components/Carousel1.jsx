import React from "react";
import { Card, Pagination } from "react-bootstrap";

function Carousel1() {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent:"space-between" }}>
        <h2>Alojamientos mas populares</h2>
        <Pagination>
          <Pagination.Prev />
          <Pagination.Next />
        </Pagination>
      </div>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Card Subtitle
          </Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Carousel1;
