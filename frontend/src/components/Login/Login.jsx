import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
function Login() {
  const history = useNavigate();

  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("https://miniproject-0.onrender.com/", {
          username,
          password,
        })
        .then((res) => {
          if (res.data == "exist") {
            history("/homepage", { state: { id: username } });
          } else if (res.data == "notexist") {
            alert("User have not sign up");
          }
        })
        .catch((e) => {
          alert("wrong details");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="login">
      <h1 className="logo">Login</h1>
      <div className="post">
        <form action="POST">
          <input
            type="name"
            className="inp"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="username"
          />
          <input
            type="password"
            className="pass"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />
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
