import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import CircularProgress from "@material-ui/core/CircularProgress";

const Login = props => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    axiosWithAuth()
      .post("/login", credentials)
      .then(res => {
        localStorage.setItem("token", res.data.payload);
        setIsLoading(false);
        props.history.push("/dashboard");
      })
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className="login">
      <h1>Welcome to the Bubble App!</h1>
      {isLoading ? (
        <div className="loading">
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <>
          <h3>Login Below:</h3>
          <form className="loginForm" onSubmit={handleSubmit}>
            <input
              onChange={handleChange}
              type="text"
              name="username"
              placeholder="username"
              value={credentials.username}
            />

            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="password"
              value={credentials.password}
            />
            <button>Submit</button>
          </form>
        </>
      )}
      {error && (
        <div className="errorMessage">username or password not valid</div>
      )}
    </div>
  );
};

export default Login;
