import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Button, Container } from "react-bootstrap";
import Message from "../components/Message";

const ConfirmScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const roomNumbers = cartItems[0].roomNumber;

  const checkoutHandler = () => {
    navigate("/login?redirect=/payment");
  };

  return (
    <Container className="py-3">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h1 style={{ marginBottom: "20px" }}>Comfirm your Reservation</h1>
          {cartItems.length === 0 ? (
            <div className="my-3 text-center">
              <Message variant="warning">
                <p>
                  There are no reservations. <Link to="/">Go Back</Link>
                </p>
              </Message>
            </div>
          ) : (
            <ListGroup variant="flush" className="text-center">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.title} fluid rounded />
                    </Col>
                    <Col md={2}>
                      <Link to={`/rooms/${item._id}`}>{item.title}</Link>
                    </Col>
                    <Col md={3}>
                      <strong>From {item.fromDate}</strong> To{" "}
                      <strong>{item.toDate}</strong>
                    </Col>
                    <Col> Room Number: {roomNumbers}</Col>
                    <Col md={2}>${item.price} per night</Col>
                  </Row>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <p>
                  <strong>SubTotal</strong>
                </p>
                $
                {cartItems
                  .reduce(
                    (acc, item) =>
                      acc +
                      item.numOfDays * item.price * item.selectedRooms.length,
                    0
                  )
                  .toFixed(2)}
              </ListGroup.Item>
            </ListGroup>
          )}
        </Col>
      </Row>
      {cartItems.length !== 0 && (
        <Row className="justify-content-center">
          <Col xs="auto">
            <Link to={`/rooms/${cartItems[0]._id}`}>
              <Button
                type="button"
                className="btn-block btn-bg px-auto"
                disabled={cartItems.length === 0}
              >
                Go Back
              </Button>
            </Link>
          </Col>
          <Col xs="auto">
            <Button
              type="button"
              className="btn-block btn-bg px-auto"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Confirm and Continue
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ConfirmScreen;
