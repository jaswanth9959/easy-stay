import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const ProfileScreen = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setFirstname(userInfo.firstname);
    setLastname(userInfo.lastname);
    setEmail(userInfo.email);
    setPhone(userInfo.phone);
  }, [userInfo.email, userInfo.lastname, userInfo.firstname, userInfo.phone]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          firstname,
          lastname,
          email,
          phone,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        setPassword("");
        setConfirmPassword("");
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className="py-3">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Update Profile</h2>

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
              <Form.Label>last Name</Form.Label>
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
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="btn-bg">
              Update
            </Button>
            {loadingUpdateProfile && <Loader />}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
