import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <h1
                className="money text-center"
                style={{
                  marginTop: "100px",
                  fontSize: "40px",
                  fontWeight: "bolder",
                  fontFamily: "monospace",
                }}
              >
                MONEY MANAGER
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
