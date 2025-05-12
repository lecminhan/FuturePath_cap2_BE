const pool = require("../Database/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { username, email, password, role_id = 1 } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate role
  if (![1, 2, 3].includes(Number(role_id))) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if user already exists
    const userExists = await client.query(
      'SELECT id FROM "User" WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Email or username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const { rows } = await client.query(
      `INSERT INTO "User" (username, email, password, status, created_at) 
   VALUES ($1, $2, $3, $4, NOW()) 
   RETURNING id, username, email, created_at`,
      [username, email, hashedPassword, "false"]
    );

    // Assign role
    await client.query(
      `INSERT INTO "UserRole" (user_id, role_id) VALUES ($1, $2)`,
      [rows[0].id, role_id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "User registered successfully",
      user: rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const client = await pool.connect();

  try {
    // Get user with role and username information
    const { rows } = await client.query(
      `SELECT u.id, u.email, u.password, u.username, r.name as role 
       FROM "User" u
       JOIN "UserRole" ur ON u.id = ur.user_id
       JOIN "Role" r ON ur.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Omit sensitive data from response
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username, // Add username here
      role: user.role,
    };

    res.json({
      success: true,
      token: `Bearer ${token}`,
      user: userResponse,
      expiresIn: 3600, // 1 hour in seconds
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

module.exports = { registerUser, loginUser };
