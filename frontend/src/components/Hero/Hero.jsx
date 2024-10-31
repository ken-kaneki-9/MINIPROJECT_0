import React, { useEffect, useState } from "react";
import axios from "axios";

function DataDisplay() {
  const [data, setData] = useState([]); // To store all services
  const [rating, setRating] = useState({}); // To store ratings for each service

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://miniproject-0.onrender.com/fetch-data")
      .then((res) => {
        setData(res.data);
        // Initialize ratings state with service IDs and empty ratings
        const initialRatings = res.data.reduce((acc, item) => {
          acc[item._id] = ""; // Initialize with empty rating
          return acc;
        }, {});
        setRating(initialRatings);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      });
  };

  const submitRating = async (usernameToRate) => {
    try {
      const ratingValue = parseInt(rating, 10); // Ensure rating is an integer

      const response = await axios.post(
        "https://miniproject-0.onrender.com/submit-review",
        {
          usernameToRate, // Pass the username of the user being rated
          rating: ratingValue, // Include the rating value
        }
      );

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

  return (
    <div>
      <h1>Uploaded Data</h1>
      {data.map((item) => (
        <li key={item._id}>
          <p>Username: {item.username}</p>
          <p>Service: {item.service}</p>
          <p>Contact: {item.contact}</p>
          <p>Price Range: {item.priceRange}</p>
          {item.image && (
            <img src={item.image} alt="Uploaded" width={100} height={100} />
          )}
          <div>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="" disabled>
                Select Rating
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button onClick={() => submitRating(item.username)}>
              {" "}
              {/* Pass username here */}
              Submit Rating
            </button>
          </div>
          <p>
            Average Rating:{" "}
            {item.averageRating ? Math.round(item.averageRating) : "N/A"}
          </p>
          <hr />
        </li>
      ))}
    </div>
  );
}

export default DataDisplay;
