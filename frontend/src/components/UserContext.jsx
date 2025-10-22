import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post(
          "http://localhost:3001/api/verify",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (!res.data.error) {
            setUser(res.data);
            setUserLoggedIn(true);
          } else {
            setUser(null);
            setUserLoggedIn(false);
          }
        })
        .catch(() => {
          setUser(null);
          setUserLoggedIn(false);
        });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userLoggedIn,
        setUserLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
