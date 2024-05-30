import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { UserLogin, UserRegister } from "../Servises/auth.service";

interface LoginProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogout, isLoggedIn }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex justify-center items-center mt-16">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-bold mb-4">
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
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
              disabled={isLoading}
            >
              {isLogin ? "Login" : "Register"}
            </button>
            {isLoading && (
              <div className="flex justify-center mt-3">
                <div className="loader border-t-2 border-b-2 border-blue-500 w-6 h-6 rounded-full animate-spin"></div>
              </div>
            )}
            {error && <div className="text-red-500 mt-3">{error}</div>}
          </form>
          <div className="text-center mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
