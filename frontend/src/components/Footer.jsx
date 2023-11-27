import { Container, Row, Col, Image } from "react-bootstrap";
import logo from "../assets/logo.png";
import { FaMapMarkerAlt } from "react-icons/fa";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-light p-4 text-center bg-dark">
      <Container>
        <Row>
          <Col md={6}>
            <Image src={logo} width={250} />
            {/* <h5>EasyStay</h5> */}
          </Col>
          <Col md={6}>
            <h5>
              <FaMapMarkerAlt /> Address
            </h5>
            <p> 502 S Main St, Lee's Summit, MO-64097</p>
          </Col>

          {/* <Col md={4}>
            <h5>Timings</h5>
            <p>Monday - Friday: 10 AM - 6 PM</p>
          </Col> */}
        </Row>
        <Row>
          <Col className="text-center py-3">
            <p>EasyStay &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
