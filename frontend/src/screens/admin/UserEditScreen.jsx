import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, firstname, lastname, email, phone, isAdmin });
      toast.success("user updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setPhone(user.phone);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <Container>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter First name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* <Form.Group className="my-2" controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group> */}

            <Button type="submit" variant="primary" className="btn-bg">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default UserEditScreen;
