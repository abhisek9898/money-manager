import React, { useState, useEffect } from "react";
import { Client, Account, ID } from "appwrite";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

interface LoginProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e6a6f0780da76d3c7e");

const account = new Account(client);

const Login: React.FC<LoginProps> = ({ onLogout, isLoggedIn }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState< string | null >(null);

  const navigation = useNavigate();

  const handleSubmit = async (e: React.FormEvent< HTMLFormElement> ) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await account.createEmailSession(username, password);
      } else {
        await account.create(ID.unique(), username, password);
      }

      navigation("/expensepage");
    } catch (error: any) {
      console.log(error.message || "Unknown error occurred");
      setError("Invalid username or password");
    }
  };

  const [isLoading, setIsLoading] = useState< boolean >(true);

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
                      <button type="submit" className="btn btn-primary w-100">
                        {isLogin ? "Login" : "Register"}
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
}
export default Login;
