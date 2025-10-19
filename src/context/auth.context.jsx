import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  const authenticateUser = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
      setIsValidatingToken(false);
    } catch (error) {
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  const passedContext = {
    isLoggedIn,
    loggedUserId,
    authenticateUser,
  };

  if (isValidatingToken) {
    return (
      <div>
        <h3>...validando usuario</h3>
        <img src="loading.gif"/>
      </div>
      // hacer esta animacion muy bien hecha!!! muy importante
    );
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
