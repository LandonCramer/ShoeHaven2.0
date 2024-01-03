import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SneakerCard from "./SneakerCard";
import { UserContext } from "../Helpers/AuthProvider";

const LoggedInHome = () => {
  const [sneakers, setSneakers] = useState([]);
  const navigate = useNavigate();
  const { currentUser, handleSetUser } = useContext(UserContext);
  console.log("currentUser home page: ", currentUser);

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length === 0) {
      navigate("/login");
    } else if (!currentUser) {
      // Fetch current user only if currentUser is not already set
      fetch("/currentuser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((user) => {
            handleSetUser(user);
          });
        }
      });
    }
  }, [currentUser, navigate, handleSetUser]); // Removed dependency on handleSetUser if it changes frequently

  useEffect(() => {
    // Separate useEffect for fetching sneakers
    fetchSneakers();
  }, []); // Empty dependency array means this runs once after the component mounts

  const fetchSneakers = () => {
    fetch("http://127.0.0.1:5555/sneakers")
      .then((res) => res.json())
      .then((data) => setSneakers(data))
      .catch((err) => console.log(err));
  };

  const storeFront = (
    <div className="container">
      <div className="row">
        {sneakers.map(shoe => (
          <div key={shoe.id} className="col-md-4 mb-3">
            <SneakerCard
              id={shoe.id}
              brand={shoe.brand}
              name={shoe.name}
              color={shoe.color}
              description={shoe.description}
              price={shoe.price}
              image={shoe.image}
              link={shoe.link}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sneakers">
      <h1>List of Sneakers: ShoeHaven Logged In</h1>
      {storeFront}
    </div>
  );
};

export default LoggedInHome;
