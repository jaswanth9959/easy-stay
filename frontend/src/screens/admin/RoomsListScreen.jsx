import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Image } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetRoomsQuery,
  useDeleteRoomMutation,
} from "../../slices/roomsApiSlice";

const RoomsListScreen = () => {
  const { data: rooms, isLoading, error, refetch } = useGetRoomsQuery();

  const [deleteRoom, { isLoading: loadingDelete }] = useDeleteRoomMutation();

  const deleteHandler = async (id) => {
    try {
      await deleteRoom(id);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Rooms</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/admin/rooms/add">
            <Button className="my-3 btn-bg">
              <FaPlus /> Add Room
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ROOM ID</th>
                <th>Title</th>
                <th>IMAGE</th>
                <th>PRICE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <LinkContainer to={`/rooms/${room._id}`}>
                    <td>{room._id}</td>
                  </LinkContainer>
                  <td>{room.title}</td>
                  <td>
                    <Image
                      src={room.image}
                      alt={room.title}
                      height={40}
                      width={50}
                    />
                  </td>
                  <td>${room.price}</td>
                  <td>
                    <LinkContainer to={`/admin/rooms/${room._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        Edit
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(room._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default RoomsListScreen;
