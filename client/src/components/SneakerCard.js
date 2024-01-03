// We are getting all sneakers from homepg, and rendering them on the homepage
import React,{ useContext} from 'react';
// import { useState, useEffect } from 'react';
import { Card, Button} from 'react-bootstrap'
//importing the current user, when user clicks add to collection we can send the current user info
import { UserContext } from "../Helpers/AuthProvider";


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
            console.log(data.message);
            alert('Added to collection')
          })
          .catch(error => {
            console.error('Error adding to collection:', error);
          });
      } else {
        console.log('User not logged in');
      }
    }

  return (
    
      <Card variant="dark" style={{ width: '25rem' }}>
        <Card.Img variant="left" src={shopImage} alt={shopName} />
        <Card.Body>
        <Card.Title>{shopBrand}</Card.Title>
          <Card.Title>{shopName}</Card.Title>
          <Card.Subtitle>{shopColorway}</Card.Subtitle>
          <Card.Text>
            {shopDescription}
          </Card.Text>
          <Button variant="dark" href={shopLink}>
             {"Purchase for $"}{shopPrice}{" from ShoeHaven"}
             </Button><br/><br/>
          <Button variant="dark" onClick={addShoesToCollection}>
             {"Add to Collection"} </Button>
            <br/>
            <br/>
        </Card.Body>
      </Card>    
  
  )
}

export default SneakerCard;