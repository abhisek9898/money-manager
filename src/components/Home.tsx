import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import logo from "../assets/logo.png";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjusted to 1.5 seconds to better see the spinner

    return () => clearTimeout(timeout);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-[100vh] overflow-hidden bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="text-center flex flex-col items-center -mt-40">
          <img
            src={logo}
            alt="Logo"
            className="w-32 h-32 mr-6 mix-blend-multiply opacity-100"
          />
          <div className="text-center flex flex-col items-center">
            <h1 className="text-3xl font-extrabold font-mono sm:text-6xl lg:text-5xl mr-2">
              MONEY <br /> MANAGER
            </h1>
          </div>
          <button
            onClick={handleGetStarted}
            className="mt-6 bg-red-400 text-white font-bold py-2 px-6 rounded hover:bg-red-600 transition duration-600"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
