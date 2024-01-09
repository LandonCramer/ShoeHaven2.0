// We are getting all sneakers from homepg, and rendering them on the homepage
import React, {useContext} from 'react';
// import { useState, useEffect } from 'react';
import { Card, Button} from 'react-bootstrap'
//importing the current user, when user clicks add to collection we can send the current user info

import { UserContext } from '../Helpers/AuthProvider';

//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UserSneakerCard({image, name, color, link, description, price, id, brand, note, cartItem, setCartItem, onClick, onDelete}) {
    const { currentUser } = useContext(UserContext);


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
    

    const handleWishList = (sneakerId) => {
        const userId = currentUser.current_user_id; // Assuming currentUser contains the logged-in user's data
        const token = localStorage.getItem('accessToken');
        
        fetch('/add-to-wish-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_id: userId, sneaker_id: sneakerId })
        })
        .then(response => response.json())
        .then(data => {
          toast(data.message)
          console.log(data.message);
          // Additional logic for successful addition
        })
        .catch(error => console.error('Error:', error));
      };
      
      // // Stripe Payment
      // const handleSubmit = async () => {
      //   try {
      //     const response = await fetch(`/create-checkout-session/${id}`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         // Additional headers if needed
      //       },
      //     });
      
      //     // Check for a redirect response (303 See Other)
      //     if (response.ok) {
      //       // Get the redirect URL from the 'Location' header
      //       const checkoutUrl = response.headers.get('Location');
      //       // Redirect the browser to the Stripe checkout page
      //       window.location.href = checkoutUrl;
      //     } else {
      //       console.error('Error during checkout:', response.statusText);
      //     }
      //   } catch (error) {
      //     console.error('Error during checkout:', error.message);
      //   }
      // };
    
 
  return (
    
      <Card variant="dark" style={{ width: '25rem' }}>
        <Card.Img variant="left" src={shopImage} alt={shopName} />
        <Card.Body>
          <Card.Title>{shopName}</Card.Title>
          <Card.Subtitle>{shopColorway}</Card.Subtitle>
          <Card.Text>
            {shopDescription}
          </Card.Text>
          <div>
          {note && <div>Note: {note}</div>}
          </div>
          <h4>SALE: $100</h4>
          <br></br>
          <Button variant="dark" href={shopLink}>
          {"Purchase "}{" from "}{shopBrand}
             </Button><br/><br/>
         
            <br/>
            <Button variant='primary' onClick={()=>onClick(newShoe)}>Update</Button>
            {' '}
            <Button variant='primary' style={{backgroundColor:'red'}} onClick={()=>onDelete(id)}>Delete</Button>
            {' '}
            <Button onClick={() => handleWishList(id)}>Wish List</Button>
            <br/>
            <br/>
            {/* <form onSubmit={()=>handleSubmit(id)}>
                <Button variant='primary' type='submit'>Checkout</Button>
            </form> */}
            <form action={`/create-checkout-session/${id}`} method='POST'>
                  <Button variant='primary' type='submit'>Checkout</Button>
                </form>
        </Card.Body>
        <ToastContainer />
      </Card>    
  
  )
}

export default UserSneakerCard;