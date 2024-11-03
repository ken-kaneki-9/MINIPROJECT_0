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
      <h1>Hello {location.state.id} and welcome to the home</h1>
      <h1>Let's upload</h1>
      <input accept="image/*" type="file" onChange={convertToBase64} />
      {image && <img width={100} height={100} src={image} alt="Preview" />}

      <div>
        <label>
          Service:
          <select
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
        </label>
      </div>

      <div>
        <label>
          Contact:
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Price Range:
          <input
            type="text"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5" // Adjust rows as needed
            required
          />
        </label>
      </div>

      <div>
        <label>
          Email:
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Time Duration:
          <input
            type="text"
            value={timeduration}
            onChange={(e) => setTimeduration(e.target.value)}
            required
          />
        </label>
      </div>

      <button onClick={uploadImage}>Submit</button>
    </div>
  );
}

export default Home;
