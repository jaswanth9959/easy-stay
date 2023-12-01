import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "../../slices/categoryApiSlice";
import {
  useGetRoomDetailsQuery,
  useUpdateRoomMutation,
  useUploadRoomImageMutation,
} from "../../slices/roomsApiSlice";
const EditRoomScreen = () => {
  const { id: roomId } = useParams();
  const { data: room } = useGetRoomDetailsQuery(roomId);
  const { data: categories } = useGetCategoriesQuery();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [rooms, setRooms] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const ar = [];

  const roomNums = room?.roomNumbers?.map((room) => ar.push(room.number));
  const updatedRoomNums = ar.join(",");

  const [updateRoom, { isLoading: loadingupdate }] = useUpdateRoomMutation();

  const [uploadRoomImage, { isLoading: loadingUpload }] =
    useUploadRoomImageMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const roomNumbers = rooms?.split(",").map((room) => ({ number: room }));
    try {
      await updateRoom({
        roomId,
        title,
        price,
        image,
        category,
        description,
        roomNumbers,
      });

      toast.success("room is updated successfully");

      navigate("/admin/rooms");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadRoomImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (room) {
      setTitle(room.title);
      setCategory(room.category);
      setPrice(room.price);
      setImage(room.image);
      setDescription(room.description);
      setRooms(updatedRoomNums);
    }
  }, [room, updatedRoomNums]);

  return (
    <Container className="py-3">
      <Link to="/admin/rooms">
        <Button type="button" className="btn-bg my-3">
          Go Back
        </Button>
      </Link>
      <FormContainer>
        <h1>Add Room</h1>
        {loadingupdate && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control
              label="Choose File"
              onChange={uploadFileHandler}
              type="file"
            ></Form.Control>
            {loadingUpload && <Loader />}
          </Form.Group>

          <Form.Group controlId="roomNumbers">
            <Form.Label>Room Numbers</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Room Numbers"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              placeholder="select Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {" "}
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            style={{ marginTop: "1rem" }}
            className="btn-bg"
          >
            Update
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};
export default EditRoomScreen;
