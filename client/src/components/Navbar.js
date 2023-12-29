import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Helpers/AuthProvider";

const LoggedInLinks = () => {
    const { logoutUser } = useContext(UserContext);

    const handleLogout = (e) => {
      e.preventDefault();
      logoutUser();
      // Optionally redirect to home or login page
    };
  
  return (
    <>
      <li className="nav-item active">
        <Link className="nav-link active" to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/sneaker">
          Sneakers
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/create-subscription-session">
          Create Subscription Session
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/login" onClick={handleLogout}>
          Log Out
        </Link>
      </li>
    </>
  );
};

const LoggedOutLinks = () => {
  return (
    <>
      {/* <li className="nav-item active">
        <Link className="nav-link active" to="/">
          Home
        </Link>
      </li> */}
      <li className="nav-item">
        <Link className="nav-link active" to="/signup">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/login">
          Login
        </Link>
      </li>
    </>
  );
};

const NavBar = () => {
  const { currentUser } = useContext(UserContext);
  const loggedIn = currentUser && Object.keys(currentUser).length > 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="">
        ShoeHaven
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {loggedIn ? <LoggedInLinks /> : <LoggedOutLinks />}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
