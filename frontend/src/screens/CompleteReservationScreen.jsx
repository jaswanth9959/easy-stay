import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useCreateReservationMutation } from "../slices/reservationsApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { clearCartItems } from "../slices/cartSlice";
const CompleteReservationScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createReservation, { isLoading, error }] =
    useCreateReservationMutation();

  const clickHandler = async () => {
    try {
      const res = await createReservation({
        reservationItems: cart.cartItems,
        paymentMethod: cart.paymentMethod,
        roomsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/reservation/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };
  return (
    <div>
      <Container>
        <Link className="btn btn-light my-3" to="/payment">
          Go Back
        </Link>
        <Row>
          <h1>Complete Reservation</h1>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Room Details</h2>
                {cart.cartItems.length === 0 ? (
                  <Message>No reservation items!</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.title}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col md={2}>{item.title}</Col>
                          <Col md={5}>
                            From: <strong>{item.fromDate}</strong> To:{" "}
                            <strong>{item.toDate}</strong>
                          </Col>
                          <Col md={3}>
                            Number of Days: <strong>{item.numOfDays}</strong>
                          </Col>
                          <Col md={1}>
                            <strong>
                              $
                              {item.numOfDays *
                                item.price *
                                item.selectedRooms.length}
                            </strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Customer Details</h2>
                <p>
                  <strong>Name: </strong> {userInfo.name}
                </p>
                <p>
                  <strong>Email: </strong> {userInfo.email}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2> Reservation Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Rooms Price</Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${cart.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                {error && (
                  <ListGroup.Item>
                    <Message variant="danger">{error.data.message}</Message>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block btn-bg"
                    disabled={cart.cartItems === 0}
                    onClick={clickHandler}
                  >
                    Complete Reservation
                  </Button>
                  {isLoading && <Loader />}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompleteReservationScreen;
