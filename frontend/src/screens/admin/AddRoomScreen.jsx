import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "../../slices/categoryApiSlice";
import {
  useCreateRoomMutation,
  useUploadRoomImageMutation,
} from "../../slices/roomsApiSlice";
const AddRoomScreen = () => {
  const { data: categories } = useGetCategoriesQuery();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [rooms, setRooms] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  // const [roomNumbers, setRoomNumbers] = useState([]);
  const [category, setCategory] = useState("");

  const [createRoom, { isLoading: loadingcreate }] = useCreateRoomMutation();

  const [uploadRoomImage, { isLoading: loadingUpload }] =
    useUploadRoomImageMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const roomNumbers = rooms?.split(",").map((room) => ({ number: room }));
    try {
      await createRoom({
        title,
        price,
        image,
        category,
        description,
        roomNumbers,
      });
      toast.success("room is added successfully");
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
  return (
    <Container className="py-3">
      <Link to="/admin/rooms">
        <Button type="button" className="btn-bg my-3">
          Go Back
        </Button>
      </Link>
      <FormContainer>
        <h1>Add Room</h1>
        {loadingcreate && <Loader />}

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
            ADD
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};
export default AddRoomScreen;
