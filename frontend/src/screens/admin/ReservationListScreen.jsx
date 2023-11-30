import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Container } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetReservationsQuery } from "../../slices/reservationsApiSlice";

const ReservationListScreen = () => {
  const { data: reservations, isLoading, error } = useGetReservationsQuery();

  return (
    <Container className="py-3">
      <h1>Reservations</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>CHECKEDIN</th>
              <th>CHECKEDOUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation._id}</td>
                <td>{reservation.user && reservation.user.name}</td>
                <td>{reservation.createdAt.substring(0, 10)}</td>
                <td>${reservation.roomsPrice + reservation.taxPrice}</td>
                {/* <td>
                  {reservation.isPaid ? (
                    reservation.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td> */}
                <td></td>
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
                    <Button variant="light" className="btn-sm">
                      View
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ReservationListScreen;
