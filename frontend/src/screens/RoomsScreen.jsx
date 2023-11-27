//import { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useGetRoomsQuery } from "../slices/roomsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
const RoomsScreen = () => {
  // const [rooms, setRooms] = useState([]);
  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     const { data } = await axios.get("/api/rooms");
  //     setRooms(data);
  //   };

  //   fetchRooms();
  // }, []);

  const { data: rooms, isLoading, error } = useGetRoomsQuery();
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
          <h2>Room Types</h2>
          {rooms.map((room) => (
            <Row className="mt-3" key={room._id}>
              <Col md={{ span: 8, offset: 2 }}>
                <Card>
                  <Card.Img src={room.image} variant="top" height={350} />

                  <Card.Body className="text-center">
                    <Card.Title as="div">
                      <strong>{room.title}</strong>
                    </Card.Title>

                    <Card.Text as="div">
                      <strong>{room.category.name}</strong>
                    </Card.Text>
                    <Link to={`/rooms/${room._id}`}>
                      <Button type="button" bg="dark">
                        Check Availability
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))}
        </>
      )}
    </>
  );
};

export default RoomsScreen;
