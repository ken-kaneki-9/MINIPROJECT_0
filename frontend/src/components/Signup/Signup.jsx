import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";
function Signup() {
  const history = useNavigate(); // Hook to programmatically navigate
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password

  // Function to handle form submission
  async function submit(e) {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post(
        // "https://miniproject-0.onrender.com/signup",
        "http://localhost:8000/signup",
        {
          username,
          password,
        }
      );

      console.log("Signup response:", response.data); // Log the response data

      if (response.data === "exist") {
        alert("User already exists"); // Alert if user already exists
      } else if (response.data === "notexist") {
        // Store the username in local storage
        localStorage.setItem("username", username);
        console.log("Stored username in localStorage:", username); // Log for verification

        // Redirect to the home page if signup is successful
        console.log("Redirecting to /home..."); // Log before redirection
        history("/homepage", { state: { id: username } });
      }
    } catch (error) {
      console.error("Signup error:", error); // Log any errors
      alert("An error occurred. Please try again."); // Generic error message
    }
  }

  return (
    <div className="signup login">
      <h1 className="logoo">Signup</h1>
      <div className="postt">
        <form action="POST">
          <div className="input-field">
            <input
              type="text"
              onChange={(e) => {
                setUsername(e.target.value); // Set username
              }}
              required
            />
            <label htmlFor="">Enter Username</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value); // Set password
              }}
              required
            />
          <label htmlFor="">Enter Password</label>
          </div>
          <input type="submit" className="log-sub sub" onClick={submit} />

          {/* <button type="submit" onClick={submit}>
          Sign Up
        </button> */}
        </form>
      </div>
      <br />
      <p>OR</p>
      <br />
      <Link to="/">Login Page</Link> {/* Link to the login page */}
      <br />
      <p>
        <Link to="/hero">click here</Link>{" "}
      </p>{" "}
      Link to the login page
    </div>
  );
}

export default Signup; // Export the Signup component