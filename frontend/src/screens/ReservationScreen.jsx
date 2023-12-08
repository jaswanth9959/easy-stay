import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Container,
} from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetReservationDetailsQuery,
  useCheckInReservationMutation,
  useCheckOutReservationMutation,
  usePayReservationMutation,
  useGetPaypalClientIdQuery,
  useCancelReservationMutation,
} from "../slices/reservationsApiSlice";
const ReservationScreen = () => {
  const { id } = useParams();

  const {
    data: reservation,
    refetch,
    isLoading,
    error,
  } = useGetReservationDetailsQuery(id);

  const { userInfo } = useSelector((state) => state.auth);

  const [payReservation, { isLoading: loadingPay }] =
    usePayReservationMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (reservation && !reservation?.reservation?.paymentID?.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, reservation, paypal, paypalDispatch]);

  async function onApproveTest() {
    await payReservation({ id, details: { payer: {} } });
    refetch();

    toast.success("Order is paid");
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payReservation({ id, details });
        toast.success("Reservation is paid");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: reservation?.reservation?.paymentID?.totalPrice },
          },
        ],
      })
      .then((id) => {
        return id;
      });
  }
  function onError(err) {
    toast.error(err.message);
  }

  const [checkedIn, { isLoading: loadingCheckedIn }] =
    useCheckInReservationMutation();

  const [checkedOut, { isLoading: loadingCheckedOut }] =
    useCheckOutReservationMutation();

  const [cancelReservation] = useCancelReservationMutation();

  const checkInHandler = async () => {
    await checkedIn(id);
    refetch();
  };
  const checkOutHandler = async () => {
    await checkedOut(id);
    refetch();
  };
  const cancleHandler = async () => {
    await cancelReservation(id);
    refetch();
    toast.success("Your Request is sent to Admin. Refund will be initiated");
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Container>
      {userInfo.isAdmin ? (
        <Link className="btn btn-light my-3" to="/admin/reservations">
          Go Back
        </Link>
      ) : (
        <Link className="btn btn-light my-3" to="/myreservations">
          Go Back
        </Link>
      )}

      <h1> Reservation ID: {reservation?.reservation._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Reserved Room</h2>
              {reservation?.reservation?.reservationItems.length === 0 ? (
                <Message>Reservation is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {reservation?.reservation?.reservationItems?.map(
                    (item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.title}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col md={2}>
                            <Link to={`/rooms/${item.room}`}>{item.title}</Link>
                          </Col>
                          <Col>
                            RoomNumber:{" "}
                            {
                              reservation?.reservation?.reservationItems[0]
                                ?.roomNumber
                            }
                          </Col>
                          <Col md={4}>
                            From: {reservation.reservation.fromDate} to:{" "}
                            {reservation.reservation.toDate}
                          </Col>
                          <Col md={1}>${item.price} per Night</Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  )}
                </ListGroup>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {reservation.reservation.paymentID.paymentMethod}
              </p>
              {reservation.reservation.paymentID.isPaid ? (
                <Message>
                  Paid on{" "}
                  {reservation?.reservation?.paymentID?.paidAt.substring(0, 10)}{" "}
                  {/* {reservation?.reservation?.paymentID?.paidAt.substring(
                    11,
                    16
                  )}{" "} */}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Customer Details </h2>
              <p>
                <strong>Name: </strong> {reservation.user.firstname}
              </p>

              <p>
                <strong>Email: </strong> {reservation.user.email}
              </p>
              <p>
                <strong> Status: </strong>
              </p>
              {reservation.reservation.isCheckedIn ? (
                <Message>
                  Checked-IN on{" "}
                  {reservation?.reservation?.checkedInAt?.substring(0, 10)}{" "}
                  {/* {reservation?.reservation?.checkedInAt?.substring(11, 16)} */}
                </Message>
              ) : (
                <Message variant="danger">Not Checked-IN</Message>
              )}
              {reservation.reservation.isCheckedOut ? (
                <Message>
                  Checked-Out on{" "}
                  {reservation?.reservation?.checkedOutAt?.substring(0, 10)}{" "}
                  {/* {reservation?.reservation?.checkedOutAt?.substring(11, 16)} */}
                </Message>
              ) : (
                <Message variant="danger">Not Checked-Out</Message>
              )}
              {reservation.reservation?.status === "Completed" && (
                <Message variant="success">Completed</Message>
              )}
              {reservation.reservation?.status === "Canceled" && (
                <Message variant="danger">Canceled</Message>
              )}
              {reservation.reservation?.status === "Pending" && (
                <Message variant="warning">Pending</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Booking Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Room Price</Col>
                  <Col>
                    ${reservation.reservation.reservationItems[0].price}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Days</Col>
                  <Col>{reservation.reservation.numOfDays}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${reservation.reservation.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${reservation.reservation.paymentID.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {reservation?.reservation?.status === "Pending" && (
                <Button style={{ margin: "10px" }} onClick={cancleHandler}>
                  Cancel Reservation
                </Button>
              )}

              {!reservation?.reservation?.paymentID?.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {reservation?.user?.isAdmin && (
                        <Button
                          style={{ margin: "10px" }}
                          onClick={onApproveTest}
                        >
                          Mark As Paid
                        </Button>
                      )}

                      <div>
                        {userInfo._id === reservation?.user?._id && (
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        )}
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* {!reservation?.reservation?.paymentID?.isPaid &&
              reservation?.reservation?.status === "pending" ? (
                <ListGroup.Item>
                  <Button
                    style={{ marginBottom: "10px" }}
                    onClick={cancleHandler}
                  >
                    Cancel Reservation
                  </Button>
                </ListGroup.Item>
              ) : null} */}

              {loadingCheckedIn && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                reservation.reservation.status !== "Canceled" &&
                !reservation.reservation.isCheckedIn && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={checkInHandler}
                    >
                      Mark As Check-In
                    </Button>
                  </ListGroup.Item>
                )}
              {loadingCheckedOut && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                reservation.reservation.status !== "Canceled" &&
                !reservation.reservation.isCheckedOut && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={checkOutHandler}
                    >
                      Mark As Check-Out
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReservationScreen;
