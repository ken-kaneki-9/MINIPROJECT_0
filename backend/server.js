const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Set the limit to your required size, like 10mb or 20mb
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

mongoose
  .connect("mongodb://0.0.0.0:27017/MINIPROJECT")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed");
  });

const newSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  priceRange: {
    type: String,
    required: false,
  },
  service: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  rating: {
    type: [Number], // Array of ratings
    default: [], // Default to an empty array
  },
  averageRating: { type: Number, default: 0 },
});

const collection = mongoose.model("usersdatas", newSchema);

// app.get("/", (req, res) => {
//   res.send("Hello World!"); // Example response for root route
// });
app.post("/submit-review", async (req, res) => {
  const { usernameToRate, rating } = req.body; // Get the username to rate

  try {
    const userToRate = await collection.findOne({ username: usernameToRate }); // Find the user to rate

    if (!userToRate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize rating array if it doesn't exist
    if (!userToRate.rating) {
      userToRate.rating = [];
    }

    // Add the new rating to the user's ratings array
    userToRate.rating.push(rating);
    userToRate.averageRating = calculateAverageRating(userToRate.rating);

    await userToRate.save(); // Save changes to the user being rated
    res
      .status(200)
      .json({ message: "Rating submitted successfully", userToRate });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Helper function to calculate the average rating
function calculateAverageRating(ratings) {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  return total / ratings.length;
}

app.post("/upload-image", async (req, res) => {
  const { image, username, service, contact, priceRange } = req.body;

  if (!image || !username || !service || !contact || !priceRange) {
    return res.status(400).json("Image data or username is missing");
  }

  try {
    // Update the document with the corresponding username
    const result = await collection.updateOne(
      { username: username }, // Find document by username
      {
        $set: {
          image: image,
          service: service,
          contact: contact,
          priceRange: priceRange,
        },
      }, // Add or update the image field
      { upsert: true } // Create the document if it doesn't exist
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      res.json("success");
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json("Image upload failed");
  }
});
app.get("/fetch-data", async (req, res) => {
  try {
    const data = await collection.find(); // replace `YourModel` with your Mongoose model name
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await collection.find(); // Fetch all users
    res.json(users);
  } catch (e) {
    res.status(500).json("fail"); // Send a 500 error if something goes wrong
  }
});
app.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const check = await collection.findOne({ username: username });

    if (check) {
      // Compare the entered password with the hashed password
      const isMatch = await bcrypt.compare(password, check.password);
      if (isMatch) {
        res.json("exist");
      } else {
        res.json("notexist");
      }
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});
app.post("/updateProfile", async (req, res) => {
  const { username, image, price, description } = req.body;

  try {
    // Find and update the user document with new fields
    await collection.updateOne(
      { username: username },
      { $set: { image: image, price: price, description: description } }
    );
    res.json("Profile updated successfully");
  } catch (e) {
    res.status(500).json("Update failed");
  }
});
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hashing with 10 salt rounds

  const data = {
    username: username,
    password: hashedPassword,
  };

  try {
    const check = await collection.findOne({ username: username });

    if (check) {
      res.json("exist");
    } else {
      await collection.insertMany([data]);
      console.log("signup successful"); // Response after successful signup
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});
app.get("/getUser", async (req, res) => {
  const { username } = req.query;

  try {
    const user = await collection.findOne({ username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json("User not found");
    }
  } catch (e) {
    res.status(500).json("Error fetching user data");
  }
});

app.listen(8000, () => {
  console.log("port connected");
});
