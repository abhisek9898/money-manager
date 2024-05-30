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
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center overflow-hidden">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mt-48">
            <img src={logo} alt="Logo" className="w-32 h-32 mr-6" />
            <h1 className="text-5xl font-extrabold font-mono sm:text-6xl lg:text-7xl">
              MONEY <br /> MANAGER
            </h1>
          </div>
          <button
            onClick={handleGetStarted}
            className="mt-12 bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
