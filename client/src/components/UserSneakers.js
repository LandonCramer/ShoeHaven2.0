import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Helpers/AuthProvider';
import SneakerCard from './SneakerCard';

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

    return (
        <div>
            <h1>Your Sneaker Collection</h1>
            <div>
                {sneakers.length > 0 ? (
                    sneakers.map(sneaker => (
                        <SneakerCard key={sneaker.id} {...sneaker} />
                    ))
                ) : (
                    <p>No sneakers in your collection yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserSneakers;