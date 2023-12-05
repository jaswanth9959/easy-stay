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
              <th>RESERVATION ID</th>
              <th>USER</th>
              <th>CREATED DATE</th>
              <th>ROOM</th>
              <th>TOTAL</th>
              <th>CHECKEDIN</th>
              <th>CHECKEDOUT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation._id}</td>
                <td>{reservation.user && reservation.user.name}</td>
                <td>{reservation.createdAt.substring(0, 10)}</td>
                <td>{reservation.reservationItems[0].title}</td>
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
                  {reservation?.status === "Completed" && (
                    <Button
                      className="btn-sm bg-success text-light"
                      variant="light"
                    >
                      Completed
                    </Button>
                  )}
                  {reservation?.status === "Checked-In" && (
                    <Button
                      className="btn-sm bg-info text-light"
                      variant="light"
                    >
                      Checked-In
                    </Button>
                  )}
                  {reservation?.status === "Canceled" && (
                    <Button
                      className="btn-sm bg-danger text-light"
                      variant="light"
                    >
                      Canceled
                    </Button>
                  )}
                  {reservation?.status === "Pending" && (
                    <Button
                      className="btn-sm bg-warning text-light"
                      variant="light"
                    >
                      Pending
                    </Button>
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
