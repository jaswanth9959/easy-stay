//import { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useGetRoomsQuery } from "../slices/roomsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
const RoomsScreen = () => {
  const { data, isLoading, error } = useGetRoomsQuery();

  const rooms = data?.filter((room) => !room.counterAvailable);
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h2>Select Room Type</h2>
          <Row className="mt-3">
            {rooms.map((room) => (
              <Col
                md={{ span: 4, offfset: 2 }}
                sm={12}
                key={room._id}
                className="my-3"
              >
                <Card>
                  <Card.Img src={room.image} variant="top" height={250} />

                  <Card.Body className="text-center">
                    <Card.Title as="div">
                      <strong>{room.title}</strong>
                    </Card.Title>

                    <Card.Text as="div">
                      <strong>{room.category.name}</strong>
                    </Card.Text>
                    <Link to={`/rooms/${room._id}`}>
                      <Button type="button" bg="dark" className="btn-bg">
                        Check Availability
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default RoomsScreen;
