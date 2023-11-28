import { useState } from "react";
import { Form, Button, Col, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/completeReservation");
  };

  return (
    <Container>
      <Link className="btn btn-light my-3" to="/confirm">
        Go Back
      </Link>
      <FormContainer>
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Select Method</Form.Label>
            <Col>
              <Form.Check
                className="my-2"
                type="radio"
                label="PayPal or Credit Card"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary" className="btn-bg">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default PaymentScreen;
