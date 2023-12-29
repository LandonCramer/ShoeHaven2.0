import { useState, useEffect, createContext } from "react";

export const UserContext = createContext();
// we are creating the provider component that gives us access to the context data to its child components
const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // check for currentUser
    fetch("/currentuser", {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then((res) => {
        if (res.ok) {
        res.json()
      .then((user) => {
        setCurrentUser(user);
      });
    }})
  }, []);

  const handleSetUser = (userObj) => {
    setCurrentUser(userObj);
  };
  console.log("currentUser check1 AuthProvider", currentUser)

  const logoutUser = () => {
    setCurrentUser({});
    localStorage.removeItem("accessToken"); // or clear cookies, depending on your auth setup
  };

  return (
    <UserContext.Provider value={{ currentUser, handleSetUser,logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

