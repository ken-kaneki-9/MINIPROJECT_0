import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const history = useNavigate();

  const [username, setUsername] = useState(""); // Change from username to email as per input type
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:8000/", {
          username,
          password,
        })
        .then((res) => {
          if (res.data === "exist") {
            // Save username to local storage
            localStorage.setItem("username", username);
            history("/hero", { state: { id: username } });
          } else if (res.data === "notexist") {
            alert("User has not signed up");
          }
        })
        .catch((e) => {
          alert("Wrong details");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="login">
      <div className="post">
        <form action="POST">
          <h1 className="h">Login</h1>
          <div className="input-field">
            <input
              type="text" // Changed type to text for username/email
              onChange={(e) => {
                setUsername(e.target.value); // Set username instead of email
              }}
              required
            />
            <label>Enter your </label>
          </div>
          <div className="input-field">
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <label>Enter your password</label>
          </div>
          <input type="submit" className="sub" onClick={submit} />
        </form>
      </div>

      <br />
      <p>OR</p>
      <br />

      <Link to="/signup">Signup Page</Link>
    </div>
  );
}

export default Login;
