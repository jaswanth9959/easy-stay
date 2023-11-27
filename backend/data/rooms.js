const rooms = [
  {
    title: "1 Bed Room",
    image: "/images/1.jpg",
    description:
      "Discover comfort and style in our one-bedroom haven at EasyStay. Ideal for solo travelers or couples, this retreat features a chic living area with a plush sofa, a restful bedroom with a queen-size bed, and a well-equipped kitchenette. Enjoy the convenience of high-speed Wi-Fi, and our attentive 24/7 staff ensures a seamless stay.",
    rating: 4.5,
    numReviews: 12,
    price: 100,
    roomNumbers: [
      { number: 101, unavailableDates: ["2023-11-29T12:30:00Z"] },
      { number: 102, unavailableDates: [] },
      { number: 103, unavailableDates: [] },
      { number: 104, unavailableDates: [] },
    ],
  },
  {
    title: "2 Bed Room",
    image: "/images/2.jpg",
    description:
      "Unwind in our spacious two-bedroom suite at EasyStay. Perfect for families or groups, this suite features a stylish living area, two comfortable bedrooms with queen-size beds, and a well-appointed kitchenette. Modern amenities, high-speed Wi-Fi, and attentive 24/7 service ensure a delightful stay. Experience comfort and convenience in this inviting retreat.",
    rating: 4.1,
    numReviews: 10,
    price: 175,
    roomNumbers: [
      { number: 201, unavailableDates: ["2023-11-28T12:30:00Z"] },
      { number: 202, unavailableDates: [] },
      { number: 203, unavailableDates: [] },
      { number: 204, unavailableDates: [] },
    ],
  },
  {
    title: "The PentHouse",
    image: "/images/3.jpg",
    description:
      "Indulge in luxury at our penthouse suite at EasyStay. This opulent space offers panoramic views, an expansive living area, and lavish amenities. Two master bedrooms with king-size beds, a gourmet kitchen, and a private terrace elevate your stay. Immerse yourself in the pinnacle of elegance and personalized service for an unforgettable experience.",
    rating: 4.3,
    numReviews: 5,
    price: 250,
    roomNumbers: [
      { number: 301, unavailableDates: ["2023-11-28T12:30:00Z"] },
      { number: 302, unavailableDates: ["2023-11-29T12:30:00Z"] },
    ],
  },
  {
    title: "The Apartment Style",
    image: "/images/4.jpg",
    description:
      "Experience home-like comfort in our apartment-style accommodations at [Hotel Name]. Ideal for extended stays or a taste of residential living, these well-designed spaces feature a fully equipped kitchen, a cozy living area, and a comfortable bedroom. Enjoy the freedom of a home away from home, complete with modern amenities and personalized service.",
    rating: 4.1,
    numReviews: 10,
    price: 240,
    roomNumbers: [
      { number: 205, unavailableDates: ["2023-11-28T12:30:00Z"] },
      { number: 206, unavailableDates: ["2023-11-30T12:30:00Z"] },
      { number: 207, unavailableDates: ["2023-11-28T12:30:00Z"] },
      { number: 208, unavailableDates: ["2023-11-26T12:30:00Z"] },
    ],
  },
];
export default rooms;
