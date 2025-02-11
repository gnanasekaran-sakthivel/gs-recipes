import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth.js";
import "../index.css";
import "../styles/general.css";
import { login } from "../api/authAPI";

interface LoginData {
  username: string;
  password: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });

  // This is inserted to capture login error...
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(""); // Reset error message on component mount
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      alert("Both fields are required!");
      return;
    }

    try {
      const data = await login(loginData);

      console.log(`Login response... `);
      Auth.login(data.token, loginData.username);
    } catch (err) {
      console.error(`Failed to login ${err}`);
      setErrorMessage(`${err}`); // Set error message
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
        />
        <button className="submit" type="submit">
          Login
        </button>

        {/* Conditionally render error message if it exists */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
      <p className="register">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
