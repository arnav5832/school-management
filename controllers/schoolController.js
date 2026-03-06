const { pool } = require("../config/database");
const geolib = require("geolib");

/**
 * Add a new school to the database
 */
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO schools (name, address, latitude, longitude)
       VALUES (?, ?, ?, ?)`,
      [
        name.trim(),
        address.trim(),
        parseFloat(latitude),
        parseFloat(longitude),
      ]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM schools WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: rows[0],
    });

  } catch (error) {
    console.error("Error adding school:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error while adding school",
      error: error.message,
    });
  }
}


/**
 * GET /listSchools
 */
async function listSchools(req, res) {
  try {
    const userLatitude = parseFloat(req.query.latitude);
    const userLongitude = parseFloat(req.query.longitude);

    const [schools] = await pool.execute("SELECT * FROM schools");

    const schoolsWithDistance = schools.map((school) => {

      const distanceMeters = geolib.getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: school.latitude, longitude: school.longitude }
      );

      return {
        ...school,
        distance_km: parseFloat((distanceMeters / 1000).toFixed(2)),
      };
    });

    // sort nearest schools
    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    res.status(200).json({
      success: true,
      message: "Schools retrieved successfully",
      user_location: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      total: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });

  } catch (error) {
    console.error("Error fetching schools:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error while fetching schools",
      error:  error.message ,
    });
  }
}

module.exports = { addSchool, listSchools };