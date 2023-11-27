import { useState } from "react";
import { Row, Col, Card, Button, ListGroup, Image } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetRoomDetailsQuery } from "../slices/roomsApiSlice";

const RoomDetailsScreen = () => {
  const { id: roomId } = useParams();
  const { data: room, isLoading, error } = useGetRoomDetailsQuery(roomId);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const dates = JSON.parse(localStorage.getItem("dates"));
  const fromDate = new Date(dates[0].startDate).toLocaleDateString("en-US");
  const toDate = new Date(dates[0].endDate).toLocaleDateString("en-US");

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };
  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Link className="btn btn-light my-3" to="/rooms">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          <h5 className="text-center">
            From:{fromDate} - To:{toDate}
          </h5>
          <Col md={{ span: 6, offset: 1 }}>
            <Image src={room.image} alt={room.title} fluid />
            <ListGroup variant="flush" className="text-center">
              <ListGroup.Item>
                <Rating
                  value={room.rating}
                  text={`${room.numReviews} reviews`}
                />
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={{ span: 4, offset: 1 }}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    <strong>{room.title}</strong>
                  </h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Price:</strong> ${room.price} per night
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Description:</strong> {room.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Category: </strong>
                  {room.category?.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col>
                    <strong>Select Room :</strong>
                  </Col>
                  <Col>
                    <div className="rSelectRooms">
                      {room?.roomNumbers?.map((roomNumber) => (
                        <div className="room" key={roomNumber.number}>
                          <label>{roomNumber.number}</label>
                          <input
                            type="checkbox"
                            value={roomNumber._id}
                            onChange={handleSelect}
                            disabled={!isAvailable(roomNumber)}
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </ListGroup.Item>

                <ListGroup.Item className="text-center">
                  <Button
                    className="btn-block btn-bg"
                    type="button"
                    onClick={handleClick}
                  >
                    Continue
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default RoomDetailsScreen;
