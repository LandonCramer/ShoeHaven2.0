import React, { useState } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";

const CreateSneakerPage = () => {
  const [sneaker, setSneaker] = useState({
    name: '',
    color: '',
    brand: '',
    price: '',
    image: '',
    link: '',
    description: ''
  });

  const handleChange = (event) => {
    setSneaker({ ...sneaker, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(sneaker);
    // Rest of the submission logic
  };

  return (
    
    <div className="container col-md-4">
        <div className="row">
      <Card>
        <Card.Body>
          <Card.Title>Create Sneaker</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Shoe Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="ex. Air Jordan 1 High"
                name="name"
                value={sneaker.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="Color"
                name="color"
                value={sneaker.color}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brand"
                name="brand"
                value={sneaker.brand}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  name="price"
                  value={sneaker.price}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <Form.Label>Image Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Image URL"
                name="image"
                value={sneaker.image}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Link to Purchase</Form.Label>
              <Form.Control
                type="text"
                placeholder="Purchase Link"
                name="link"
                value={sneaker.link}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Description"
                name="description"
                value={sneaker.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </div>
  );
};

export default CreateSneakerPage;