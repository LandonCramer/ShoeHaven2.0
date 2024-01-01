// We are getting all sneakers from homepg, and rendering them on the homepage
import React from 'react';
// import { useState, useEffect } from 'react';
import { Card, Button} from 'react-bootstrap'
//importing the current user, when user clicks add to collection we can send the current user info
// import { UserContext } from "../Helpers/AuthProvider";


function UserSneakerCard({image, name, color, link, description, price, id, brand, cartItem, setCartItem, onClick, onDelete}) {
    


    let shopImage = image
    let shopName = name
    let shopColorway = color
    let shopLink = link
    let shopDescription = description
    let shopPrice = price
    let shopID = id
    let shopBrand = brand
    
    // Using this to update sneaker
    const newShoe = {
      // key: {shopID},
      id: shopID,
      colorway: shopColorway,
      name: shopName,
      description: shopDescription,
      price: shopPrice,
      link: shopLink,
      image: shopImage,
      brand: shopBrand,
    }
    
 
  return (
    
      <Card variant="dark" style={{ width: '25rem' }}>
        <Card.Img variant="left" src={shopImage} alt={shopName} />
        <Card.Body>
          <Card.Title>{shopName}</Card.Title>
          <Card.Subtitle>{shopColorway}</Card.Subtitle>
          <Card.Text>
            {shopDescription}
          </Card.Text>
          <Button variant="dark" href={shopLink}>
             {"Purchase for $"}{shopPrice}{" from ShoeHaven"}
             </Button><br/><br/>
         
            <br/>
            <br/>
            <Button variant='primary' onClick={()=>onClick(newShoe)}>Update</Button>
            {' '}
            <Button variant='primary' style={{backgroundColor:'red'}} onClick={()=>onDelete(id)}>Delete</Button>
        </Card.Body>
      </Card>    
  
  )
}

export default UserSneakerCard;