import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Form,
  Image,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetRoomDetailsQuery,
  useCreateReviewMutation,
} from "../slices/roomsApiSlice";
import { addToCart } from "../slices/cartSlice";

const RoomDetailsScreen = () => {
  const { id: roomId } = useParams();
  const {
    data: room,
    refetch,
    isLoading,
    error,
  } = useGetRoomDetailsQuery(roomId);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const dates = JSON.parse(localStorage.getItem("dates"));
  const fromDate = new Date(dates[0].startDate).toLocaleDateString("en-US");
  const toDate = new Date(dates[0].endDate).toLocaleDateString("en-US");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.toLocaleDateString("en-US"));

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).toLocaleDateString("en-US"));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };
  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  function calcDays(isoDateString1, isoDateString2) {
    const isoDate1 = new Date(isoDateString1);
    const isoDate2 = new Date(isoDateString2);

    // Calculate the difference in milliseconds
    const timeDifference = isoDate2 - isoDate1;

    // Convert the difference from milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
  }

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).toLocaleDateString("en-US"))
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

  const handleClick = () => {
    const numOfDays = calcDays(dates[0].startDate, dates[0].endDate);

    dispatch(
      addToCart({ ...room, selectedRooms, numOfDays, fromDate, toDate })
    );
    navigate("/confirm");
  };

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        roomId,
        rating,
        comment,
      }).unwrap();
      refetch();
      setComment("");
      setRating(0);
      toast.success("Review created successfully");
    } catch (err) {
      setComment("");
      setRating(0);
      toast.error(err?.data?.message || err.error);
    }
  };
  // const handleClick = async () => {
  //   try {
  //     await Promise.all(
  //       selectedRooms.map((roomId) => {
  //         const res = axios.put(`/rooms/availability/${roomId}`, {
  //           dates: alldates,
  //         });
  //         return res.data;
  //       })
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
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
        <>
          <Row>
            <h5 className="text-center">
              From: {fromDate} - To: {toDate}
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
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h5>Check In Time: 12:00pm </h5>
                    </Col>
                    <Col>
                      <h5>Check Out Time: 11:00am </h5>
                    </Col>
                  </Row>
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
                              value={roomNumber.number}
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
                      disabled={selectedRooms.length === 0}
                    >
                      Continue
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={{ span: 6, offset: 3 }}>
              <h2>Reviews</h2>
              {room.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {room.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default RoomDetailsScreen;
