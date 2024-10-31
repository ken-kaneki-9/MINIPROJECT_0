import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
function Home() {
  const location = useLocation();
  const [image, setImage] = useState("");
  const [service, setService] = useState(""); // New state for service
  const [contact, setContact] = useState(""); // New state for contact
  const [priceRange, setPriceRange] = useState(""); // New state for price range
  const servicesList = [
    "Photography",
    "Catering",
    "Decoration",
    "Music",
    "Videography",
    "Other",
  ];
  function covertToBase64(e) {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error : " + error);
    };
  }
  function uploadImage() {
    axios
      .post("https://miniproject-0.onrender.com/upload-image", {
        image, // Only sending image data
        username: location.state.id,
        service,
        contact,
        priceRange,
      })
      .then((res) => {
        if (res.data === "success") {
          alert("Image uploaded successfully");
          setImage("");
          setService("");
          setContact("");
          setPriceRange("");
          window.location.replace("/hero");
        } else {
          alert("Image upload failed");
        }
      })
      .catch((e) => {
        alert("An error occurred");

        console.log(e);
      });
  }
  return (
    <div className="homepage">
      <h1>Hello {location.state.id} and welcome to the home</h1>
      <h1>lets upload</h1>
      <input accept="image/*" type="file" onChange={covertToBase64} />
      {image == "" || image == null ? (
        ""
      ) : (
        <img width={100} height={100} src={image}></img>
      )}
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
      <button onClick={uploadImage}>submit</button>
    </div>
  );
}

export default Home;
