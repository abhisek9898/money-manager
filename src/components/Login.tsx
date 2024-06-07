import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { UserLogin, UserRegister } from "../Servises/auth.service";
import Navbar from "./Navbar";

interface LoginProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogout, isLoggedIn }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Set initially to true for demo

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isLogin) {
        await UserLogin(username, password);
      } else {
        await UserRegister(username, password);
      }

      navigate("/expensepage");
    } catch (error: any) {
      console.log(error.message || "Unknown error occurred");
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a loading delay for demonstration
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Navbar />
      <div className="h-[93vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg -mt-11">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
              {isLogin ? "Login" : "Register"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
                disabled={isLoading}
              >
                {isLogin ? "Login" : "Register"}
              </button>
              {error && <div className="text-red-500 mt-3">{error}</div>}
            </form>
            <div className="text-center mt-4 text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                className="text-indigo-600 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
