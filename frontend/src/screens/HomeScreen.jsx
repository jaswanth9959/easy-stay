import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaBed,
  FaWifi,
  FaSwimmingPool,
  FaCar,
  FaCoffee,
  FaUtensils,
  FaTv,
  FaChild,
} from "react-icons/fa";
import { Container, Carousel, Button, Image, Row, Col } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";

function HomeScreen() {
  const carouselItems = [
    {
      id: 1,
      title: "Welcome to Our Hotel",
      description: "Book your stay with us and enjoy a luxurious experience.",
      image:
        "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      title: "Discover Comfort",
      description:
        "Experience comfort like never before in our spacious rooms.",
      image:
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with actual image URL
    },
    {
      id: 3,
      title: "Relax and Unwind",
      description:
        "Enjoy our amenities and unwind in our beautiful surroundings.",
      image:
        "https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];
  const navigate = useNavigate();

  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = () => {
    localStorage.setItem("dates", JSON.stringify(dates));
    navigate("/rooms");
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center pb-3">
        <Col
          md={{ span: 8, offset: 1 }}
          className="text-center pt-2"
          style={{ border: "2px solid #7b8a8b", borderRadius: "5px" }}
        >
          <div>
            <FaCalendar className="m-1" />
            <span
              onClick={() => setOpenDate(!openDate)}
              className="headerSearchText"
            >{`Start Date ${format(
              dates[0].startDate,
              "MM/dd/yyyy"
            )} - End Date ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
            {openDate && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDates([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dates}
                months={2}
                className="pt-3"
                direction="horizontal"
                minDate={new Date()}
              />
            )}
          </div>
        </Col>
        <Col md={{ span: 2 }} className="text-center">
          <Button variant="primary" onClick={handleSelect}>
            Search
          </Button>
        </Col>
      </Row>

      <Carousel>
        {carouselItems.map((item) => (
          <Carousel.Item key={item.id}>
            <Image
              className="d-block mx-auto my-auto"
              src={item.image}
              alt={item.title}
              fluid
            />
            <Carousel.Caption className="carousel-caption">
              <h2 className="text-white text-right">{item.title}</h2>
              <p>{item.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      <h2 className="text-center mt-3 mb-4">Our Amenities</h2>
      <Row className="text-center">
        <Col md={3} xs={6}>
          <FaWifi size={40} />
          <p>Free Wi-Fi</p>
        </Col>
        <Col md={3} xs={6}>
          <FaSwimmingPool size={40} />
          <p>Swimming Pool</p>
        </Col>
        <Col md={3} xs={6}>
          <FaCar size={40} />
          <p>Free Parking</p>
        </Col>
        <Col md={3} xs={6}>
          <FaCoffee size={40} />
          <p>Coffee Shop</p>
        </Col>
      </Row>
      <Row className="text-center mt-4">
        <Col md={3} xs={6}>
          <FaUtensils size={40} />
          <p>Restaurant</p>
        </Col>
        <Col md={3} xs={6}>
          <FaTv size={40} />
          <p>Flat-screen TV</p>
        </Col>
        <Col md={3} xs={6}>
          <FaBed size={40} />
          <p>Comfortable Beds</p>
        </Col>
        <Col md={3} xs={6}>
          <FaChild size={40} />
          <p>Kids Play Area</p>
        </Col>
      </Row>
      <div className="mail text-center">
        <h1 className="mailTitle">Save time, save money!</h1>
        <span className="mailDesc">
          Sign up and we'll send the best deals to you
        </span>
        <div className="mailInputContainer">
          <input type="text" placeholder="Your Email" />
          <button className="my-2">Subscribe</button>
        </div>
      </div>
    </Container>
  );
}

export default HomeScreen;
