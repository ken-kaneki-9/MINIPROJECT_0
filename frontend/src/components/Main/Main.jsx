import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Main.css";

function Home() {
  const location = useLocation();
  const [image, setImage] = useState("");
  const [service, setService] = useState("");
  const [contact, setContact] = useState("");
  const [Email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [timeduration, setTimeduration] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const navigate = useNavigate();

  const servicesList = [
    "Photography",
    "Catering",
    "Decoration",
    "Music",
    "Videography",
    "Other",
  ];

  function convertToBase64(e) {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.error("Error converting image:", error);
    };
  }

  function uploadImage() {
    axios
      .post("http://localhost:8000/upload-image", {
        image,
        username: location.state.id,
        service,
        contact,
        priceRange,
        description,
        Email,
        timeduration,
      })
      .then((res) => {
        if (res.data === "success") {
          alert("Image uploaded successfully");
          setImage("");
          setService("");
          setContact("");
          setPriceRange("");
          setDescription("");
          setEmail("");
          setTimeduration("");
          navigate("/hero");
        } else {
          alert("Image upload failed");
        }
      })
      .catch((e) => {
        alert("An error occurred");
        console.error(e);
      });
  }

  return (
    <div className="homepage">
      <h1 className="t">Hello {location.state.id} and welcome to the home</h1>
      <h1 className="t">Let's upload</h1>
      <div className="image_container">
        <input accept="image/*" type="file" onChange={convertToBase64} />
        <div className="image_box">
          {image && <img className="image" src={image} alt="Preview" />}
        </div>
      </div>
      <div>
        <label className="input-field t">Service:</label>

        <select
          className="select_btn"
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        >
          <option value="">Select a service</option>
          {servicesList.map((serviceName) => (
            <option key={serviceName} value={serviceName}>
              {serviceName}
            </option>
          ))}
        </select>
      </div>

      <div className="input-field">
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <label>Contact:</label>
      </div>

      <div className="input-field">
        <input
          type="text"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          required
        />
        <label>Price Range:</label>
      </div>

      <div className="description">
        <label>Description:</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          cols="160" // Adjust rows as needed
          required
          className="text_area"
        />
      </div>

      <div className="input-field">
        <input
          type="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Email:</label>
      </div>

      <div className="input-field">
        <input
          type="text"
          value={timeduration}
          onChange={(e) => setTimeduration(e.target.value)}
          required
        />
        <label>Time Duration:</label>
      </div>

      <button className="sub " onClick={uploadImage}>
        Submit
      </button>
    </div>
  );
}

export default Home;
