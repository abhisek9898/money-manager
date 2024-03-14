import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { UserLogin, UserRegister } from "../Servises/aurh.service";

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

  const navigation = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isLogin) {
        await UserLogin(username, password);
      } else {
        await UserRegister(username, password);
      }

      navigation("/expensepage");
    } catch (error: any) {
      console.log(error.message || "Unknown error occurred");
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  // const [isLoading, setIsLoading] = useState< boolean >(true);

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
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h2 className="text-center mb-4">
                      {isLogin ? "Login" : "Register"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Username:
                        </label>
                        <input
                          type="text"
                          id="username"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password:
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        position-relative
                      >
                        {isLogin ? "Login" : "Register"}
                        {isLoading && (
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </button>
                      {error && <div className="text-danger mt-3">{error}</div>}
                    </form>
                    <div className="text-center mt-3">
                      {isLogin
                        ? `Don't have an account?`
                        : "Already have an account?"}{" "}
                      <br />
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? "Register" : "Login"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;
