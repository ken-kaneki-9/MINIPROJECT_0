import React, { useEffect, useState } from "react";
import axios from "axios";

function DataDisplay() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/fetch-data") // URL should match your backend route
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      });
  }, []);

  return (
    <div>
      <h1>Uploaded Data</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <p>Username: {item.username}</p>
              <p>Service: {item.service}</p>
              <p>Contact: {item.contact}</p>
              <p>Price Range: {item.priceRange}</p>
              {item.image && (
                <img src={item.image} alt="Uploaded" width={100} height={100} />
              )}
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default DataDisplay;
