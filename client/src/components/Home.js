import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import SneakerCard from "./SneakerCard";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { UserContext } from "../Helpers/AuthProvider";

const LoggedInHome = () => {
  const [sneakers, setSneakers] = useState([]);
  const [show, setShow] = useState(false);
  const [sneakerId, setSneakerId] = useState(0);
  const [sneakerForm, setSneakerForm] = useState({
    name: "",
    color: "",
    brand: "",
    price: "",
    image: "",
    link: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    fetchSneakers();
  }, []);

  const fetchSneakers = () => {
    fetch("http://127.0.0.1:5555/sneakers")
      .then(res => res.json())
      .then(data => setSneakers(data))
      .catch(err => console.log(err));
  };

  const showModal = (id) => {
    const selectedSneaker = sneakers.find(sneaker => sneaker.id === id);
    if (selectedSneaker) {
      setSneakerForm({...selectedSneaker});
      setSneakerId(id);
      setShow(true);
    }
  };

  const closeModal = () => {
    setShow(false);
    setSneakerForm({
      name: "",
      color: "",
      brand: "",
      price: "",
      image: "",
      link: "",
      description: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSneakerForm({ ...sneakerForm, [name]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    // Validation logic here

    setErrors(tempErrors);
    return formIsValid;
  };

  const updateSneaker = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(token)}`
      },
      body: JSON.stringify(sneakerForm)
    };

    fetch(`http://127.0.0.1:5555/sneaker/${sneakerId}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        fetchSneakers();
        closeModal();
      })
      .catch(err => console.log(err));
  };

  const deleteSneaker = (id) => {
    console.log(id);
    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(token)}`
      }
    };

    fetch(`http://127.0.0.1:5555/sneaker/${id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        fetchSneakers();
      })
      .catch(err => console.log(err));
  };

  const storeFront = sneakers.map(shoe => (
    <SneakerCard
      key={shoe.id}
      id={shoe.id}
      brand={shoe.brand}
      name={shoe.name}
      color={shoe.color}
      description={shoe.description}
      price={shoe.price}
      image={shoe.image}
      link={shoe.link}
      onClick={() => showModal(shoe.id)}
      onDelete={() => deleteSneaker(shoe.id)}
    />
  ));

  return (
    <div className="sneakers">
      <Modal
        show={show}
        size="lg"
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Sneaker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateSneaker}>
            {/* Form fields here, using handleInputChange for onChange */}
            {/* Example: */}
            <Form.Group>
              <Form.Label>Shoe Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="ex. Air Jordan 1 High"
                value={sneakerForm.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* Add other form fields similarly... */}
            
            <Button className="right-button" variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <h1>List of Sneakers: ShoeHaven Logged In</h1>
      {storeFront}
    </div>
  );
};

export default LoggedInHome;