import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Hero.css";
import globe_icon from "../../assets/globe.png";
import facebook_icon from "../../assets/facebook.png";
import instagram_icon from "../../assets/instagram.png";
import contact_logo from "../../assets/contact.png";
import mail_icon from "../../assets/mail.png";

function DataDisplay() {
  const [data, setData] = useState([]); // To store all services
  const [ratings, setRatings] = useState({}); // To store ratings for each service
  const [currentUsername, setCurrentUsername] = useState("");
  const authorizedUsernames = "SarvilRathour";

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
    const usernameFromStorage = localStorage.getItem("username");
    if (usernameFromStorage) {
      setCurrentUsername(usernameFromStorage);
    }
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8000/fetch-data")
      .then((res) => {
        setData(res.data);
        // Initialize ratings state with service IDs and empty ratings
        const initialRatings = res.data.reduce((acc, item) => {
          acc[item._id] = ""; // Initialize with empty rating
          return acc;
        }, {});
        setRatings(initialRatings);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      });
  };

  const submitRating = async (usernameToRate, ratingValue) => {
    try {
      const response = await axios.post("http://localhost:8000/submit-review", {
        usernameToRate,
        rating: ratingValue,
      });

      console.log("Rating submitted successfully:", response.data);
      fetchData(); // Re-fetch data to display updated average rating if needed
    } catch (error) {
      console.error(
        "Error submitting rating:",
        error.response?.data || error.message
      );
      alert("Failed to submit rating.");
    }
  };

  const handleDelete = async (id) => {
    const username = localStorage.getItem("username");

    try {
      const response = await fetch(
        `http://localhost:8000/api/deletecollection/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete field");
      }

      const data = await response.json();
      console.log("Field deleted successfully:", data);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  const handleRatingChange = (id, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [id]: value,
    }));
  };

  return (
    <div className="hero_container">
      <div className="card_container">
        {data.map((item) => (
          <li key={item._id} className="card_list">
            <div className="card_list_left">
              <p className="Avg_rating">
                Average Rating:{" "}
                {item.averageRating ? Math.round(item.averageRating) : "N/A"}
              </p>
            </div>
            <div className="card_list_center">
              {item.image && (
                <img
                  src={item.image}
                  alt="Uploaded"
                  className="Uploaded_image"
                />
              )}

              <div className="card_info_list">
                <div className="card_info">
                  <h1 className="User">{item.username}</h1>
                  <div className="mail_box">
                    <img src={mail_icon} alt="" />
                    {item.Email}
                  </div>
                  <div className="contact_button">
                    <a href="">
                      <img className="contact_logo" src={contact_logo} alt="" />
                    </a>
                    {item.contact}
                  </div>
                  <div className="description"> {item.description} </div>
                  <p className="service">Service: {item.service}</p>
                  <p>Price Range: {item.priceRange}</p>
                  <p>Duration{item.timeduration}</p>
                </div>
                <div className="hero_rating">
                  <select
                    className="rating_count"
                    value={ratings[item._id] || ""}
                    onChange={(e) =>
                      handleRatingChange(item._id, e.target.value)
                    }
                  >
                    <option value="" disabled></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>

                  <button
                    className="rating-btn"
                    onClick={() =>
                      submitRating(item.username, ratings[item._id])
                    }
                  >
                    Submit Rating
                  </button>
                  {currentUsername === authorizedUsernames && (
                    <button
                      className="rating-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="card_list_right">
              <div className="social-icons">
                <a href="" className="globe">
                  <img src={globe_icon} alt="" />
                </a>
                <a href="" className="facebook">
                  <img src={facebook_icon} alt="" />
                </a>
                <a href="" className="instagram">
                  <img src={instagram_icon} alt="" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
}

export default DataDisplay;
