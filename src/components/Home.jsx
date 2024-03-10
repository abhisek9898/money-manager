import React, { useState, useEffect } from "react";
import "./Home.css";
import LoadingSpinner from "./LoadingSpinner";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="col-md-12 text-center">
            <h1 className="money-manager-heading mt-5">MONEY MANAGER</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
