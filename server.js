const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection, initializeDatabase } = require("./config/database");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API 
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Management API is running",
    version: "1.0.0",
    endpoints: {
      addSchool: "POST /addSchool",
      listSchools: "GET /listSchools?latitude=<lat>&longitude=<lon>"
    }
  });
});

// Routes
app.use("/", schoolRoutes);

// error
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

async function startServer() {
  await testConnection();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();