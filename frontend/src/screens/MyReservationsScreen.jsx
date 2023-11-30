import { Table, Button, Row, Col, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetMyReservationsQuery } from "../slices/reservationsApiSlice";

const MyReservationsScreen = () => {
  const { data: reservations, isLoading, error } = useGetMyReservationsQuery();

  return (
    <Container className="py-3">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h2>My Reservations</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Table hover responsive bordered className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>Checked-In</th>
                  <th>Checked-Out</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>{reservation._id}</td>
                    <td>{reservation.createdAt.substring(0, 10)}</td>
                    <td>${reservation.roomsPrice + reservation.taxPrice}</td>

                    <td>
                      {reservation.isCheckedIn ? (
                        reservation?.checkedInAt?.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {reservation.isCheckedOut ? (
                        reservation?.checkedOutAt?.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/reservation/${reservation._id}`}>
                        <Button
                          className="btn-sm btn-bg text-light"
                          variant="light"
                        >
                          View
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyReservationsScreen;
