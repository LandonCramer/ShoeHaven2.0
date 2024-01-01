import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Helpers/AuthProvider';
import UserSneakerCard from './UserSneakerCard';

import { Modal, Form, Button } from "react-bootstrap";


const UserSneakers = () => {
    const [sneakers, setSneakers] = useState([]);
    const { currentUser } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedSneakerId, setSelectedSneakerId] = useState(null);
    const [formErrors, setFormErrors] = useState({}); // New state for form errors
    const [sneakerForm, setSneakerForm] = useState({
      name: '',
      color: '',
      brand: '',
      price: '',
      image: '',
      link: '',
      description: ''
  });

    useEffect(() => {
        // Use currentUser.current_user_id to get the user ID
        const userId = currentUser.current_user_id;

        if (userId) {
            fetch(`/user-sneakers/${userId}`)
                .then(res => res.json())
                .then(data => {
                    setSneakers(data.sneakers);
                })
                .catch(error => console.error('Error fetching user sneakers:', error));
        }
    }, [currentUser]);

    const openUpdateModal = (sneaker) => {
      console.log('SNEAKER UPDATE', sneaker)
      setShowModal(true);
      setSelectedSneakerId(sneaker.id);
      // Set form values
      setSneakerForm({
          name: sneaker.name,
          color: sneaker.colorway,
          brand: sneaker.brand,
          price: sneaker.price,
          image: sneaker.image,
          link: sneaker.link,
          description: sneaker.description
      });
  };

  const handleInputChange = (e) => {
      setSneakerForm({ ...sneakerForm, [e.target.name]: e.target.value });
  }

  const validateForm = () => {
    let errors = {};
    // Add validation logic here
    if (!sneakerForm.description) {
        errors.description = 'Description is required';
    }
    // ... other validations
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Form is valid if no errors
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) {
    return; // Prevent form submission if validation fails
  }

  // API call to add a note to the user's sneaker
  let token = localStorage.getItem('accessToken');
  const requestOptions = {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ note: sneakerForm.description }) // Send only the note
  };

  fetch(`http://127.0.0.1:5555/add-note-to-user-sneaker/${selectedSneakerId}`, requestOptions)
      .then(res => res.json())
      .then(data => {
          console.log("Response From Update:", data);
          // Refresh the list of sneakers
          setShowModal(false);
          setSneakers(currentSneakers => {
              return currentSneakers.map(sneaker => {
                  if (sneaker.id === selectedSneakerId) {
                      return { ...sneaker, description: sneakerForm.description };
                  }
                  return sneaker;
              });
          });
      })
      .catch(err => console.log("Error in adding note:", err));
};


    const deleteSneaker = (sneakerId) => {
      if (currentUser && currentUser.current_user_id) {
          console.log("Deleting sneaker", sneakerId, "for user", currentUser.current_user_id);
          let token = localStorage.getItem('accessToken');

          const requestOptions = {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  userId: currentUser.current_user_id,
                  sneakerId: sneakerId
              })
          };

          fetch(`http://127.0.0.1:5555/delete-sneaker`, requestOptions)
              .then(res => res.json())
              .then(data => {
                  console.log("Response From Delete:", data);
                  // Remove the deleted sneaker from the state
                  setSneakers(currentSneakers => currentSneakers.filter(sneaker => sneaker.id !== sneakerId));
              })
              .catch(err => console.log("Error in delete:", err));
      } else {
          console.log('User not identified for delete operation');
      }
  };


    return (
        <div>
            <h1>Your Sneaker Collection</h1>
            <div>
                {sneakers.length > 0 ? (
                    sneakers.map(sneaker => (
                        <UserSneakerCard key={sneaker.id} {...sneaker} onDelete={deleteSneaker} onClick={openUpdateModal} />
                    ))
                ) : (
                    <p>No sneakers in your collection yet.</p>
                )}
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Update Sneaker Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group>
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={sneakerForm.description}
                        onChange={handleInputChange}
                        placeholder="Add a note about this sneaker"
                    />
                    {formErrors.description && (
                        <p style={{ color: "red" }}>
                            <small>{formErrors.description}</small>
                        </p>
                    )}
                </Form.Group>
                <Button className="right-button" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
        </div>
    );
};

export default UserSneakers;