import { useState, useEffect, createContext } from "react";

export const UserContext = createContext();
// we are creating the provider component that gives us access to the context data to its child components
const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // Check for currentUser
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetch("/currentuser", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the variable directly
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json(); // Ensure to return this promise
          } else {
            throw new Error("Failed to fetch user");
          }
        })
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          // Handle any errors, such as clearing invalid tokens
        });
    }
  }, []);

  const loginUserHelper = async (credentials) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      };

      const response = await fetch("/login", requestOptions);
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const user = await response.json();
      setCurrentUser(user); // Update currentUser with the logged-in user details
      localStorage.setItem("accessToken", user.accessToken); // Assuming the response includes an accessToken
    } catch (error) {
      console.error("Login error:", error);
      // Handle login errors, such as showing a message to the user
    }
  };

  const handleSetUser = (userObj) => {
    setCurrentUser(userObj);
  };
  console.log("currentUser check1 AuthProvider", currentUser);

  const logoutUser = () => {
    setCurrentUser({});
    localStorage.removeItem("accessToken");
  };

  return (
    <UserContext.Provider value={{ currentUser, handleSetUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
