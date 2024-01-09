// We are getting all sneakers from homepg, and rendering them on the homepage
import React,{ useContext} from 'react';
// import { useState, useEffect } from 'react';
import { Card, Button} from 'react-bootstrap'
//importing the current user, when user clicks add to collection we can send the current user info
import { UserContext } from "../Helpers/AuthProvider";

//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SneakerCard({image, name, color, link, description, price, id, brand, cartItem, setCartItem}) {
  const { currentUser } = useContext(UserContext);
  // console.log("currentUser home SneakerCard: ", currentUser.current_user_id);

    let shopImage = image
    let shopName = name
    let shopColorway = color
    let shopLink = link
    let shopDescription = description
    let shopPrice = price
    let shopBrand = brand
    


    
    function addShoesToCollection() {
      // Send request to backend
      let token = localStorage.getItem("accessToken");
     
      if (currentUser) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify({ userID: currentUser.current_user_id, sneakerID: id })
        };
        console.log("Checking to see if we are getting user and sneaker id",{ userID: currentUser.current_user_id, sneakerID: id })
        fetch('/add-to-collection', requestOptions)
      .then(response => response.json())
      .then(data => {
        // Check here if the addition was successful, then show a toast
        toast("Added to collection", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(error => {
        // Handle any errors here
        toast.error('Error adding to collection');
      });
  } else {
    // Handle case when user is not logged in
    toast.error('User not logged in');
  }
}

  return (
    
      <Card variant="dark" style={{ width: '25rem' }}>
        <Card.Img variant="left" src={shopImage} alt={shopName} />
        <Card.Body>
        <Card.Title>{shopBrand}</Card.Title>
          <Card.Title>{shopName}</Card.Title>
          <Card.Subtitle>{shopColorway}</Card.Subtitle>
          <br/>
          <Card.Text>
            {shopDescription}
             ${shopPrice}
          </Card.Text>
          <h4>GRAND OPENING SALE!!</h4>
          <br></br>
          <Button variant="dark" href={shopLink}>
             {"Purchase "}{" from "}{shopBrand}
             </Button><br/><br/>
          <Button variant="dark" onClick={addShoesToCollection}>
             {"Add to Collection"} </Button>
            <br/>
            <br/>
        </Card.Body>
        <ToastContainer />
      </Card>    
  
  )
}

export default SneakerCard;