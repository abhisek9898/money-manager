import React, { FC, useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";

import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e6a6f0780da76d3c7e");

const account = new Account(client);

const Navbar: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const handleInitialCall = async () => {
      try {
        setIsLoading(true);
        const response = await account.get();
        setIsLoading(false);
        setIsLoggedIn(true);
        if (response !== null) {
          navigate("/expensepage");
        }
      } catch (error) {
        setIsLoading(false);
        setIsLoggedIn(false);
        console.log(error);
      }
    };

    handleInitialCall();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setIsLoggedIn(false);

      localStorage.removeItem("username");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <nav
          className="navbar navbar-expand-lg navbar-dark"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="container-fluid">
            <Link
              to="/"
              className="navbar-brand"
              style={{
                color: "pink",
                fontWeight: "bold",
              }}
            >
              Home
            </Link>
            <div className="d-flex justify-content-end align-items-center">
              <ul className="navbar-nav">
                <li className="nav-item">
                  {isLoggedIn ? (
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-danger"
                        style={{ color: "pink" }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn-outline-danger"
                      style={{ color: "pink" }}
                      //className="btn btn-danger"
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
