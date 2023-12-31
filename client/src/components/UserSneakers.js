import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Helpers/AuthProvider';
import UserSneakerCard from './UserSneakerCard';

const UserSneakers = () => {
    const [sneakers, setSneakers] = useState([]);
    const { currentUser } = useContext(UserContext);

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
                        <UserSneakerCard key={sneaker.id} {...sneaker} onDelete={deleteSneaker} />
                    ))
                ) : (
                    <p>No sneakers in your collection yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserSneakers;