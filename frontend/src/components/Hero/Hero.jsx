import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Hero.css";

function DataDisplay() {
  const [data, setData] = useState([]); // To store all services
  const [ratings, setRatings] = useState({}); // To store ratings for each service
  const [currentUsername, setCurrentUsername] = useState("");
  const authorizedUsernames = ["SarvilRathour", "Shivam"]; // List of authorized usernames

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
      <h1 className="Heading">Uploaded Data</h1>
      {data.map((item) => (
        <li key={item._id} className="card_list">
          {item.image && (
            <img src={item.image} alt="Uploaded" className="Uploaded_image" />
          )}
          <div className="card_info_list">
            <div className="card_info">
              <h1 className="User">{item.username}</h1>
              <p>Username: {item.username}</p>
              <p>Service: {item.service}</p>
              <p>Contact: {item.contact}</p>
              <p>Price Range: {item.priceRange}</p>
            </div>
            <div className="hero_rating">
              <select
                value={ratings[item._id] || ""}
                onChange={(e) => handleRatingChange(item._id, e.target.value)}
              >
                <option value="" disabled>
                  Select Rating
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button
                className="submit_btn"
                onClick={() => submitRating(item.username, ratings[item._id])}
              >
                Submit Rating
              </button>

              <p className="Avg_rating">
                Average Rating:{" "}
                {item.averageRating ? Math.round(item.averageRating) : "N/A"}
              </p>
              {/* Check if the current username is in the authorizedUsernames array */}
              {authorizedUsernames.includes(currentUsername) && (
                <button
                  className="submit_btn"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </div>
  );
}

export default DataDisplay;
