import jwt from "jsonwebtoken";
import tursoClient from "../config/turso.js";
import { v4 as uuidv4 } from "uuid";

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "hackathon_secret_key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || "hackathon_secret_key");
};

const findUserByPhone = async (phone) => {
  const result = await tursoClient.execute({
    sql: "SELECT * FROM users WHERE phone = ?",
    args: [phone],
  });
  return result.rows[0] || null;
};

const createOrUpdateUser = async ({ phone, name, role, district }) => {
  const existing = await findUserByPhone(phone);

  if (existing) {
    // Update existing user
    await tursoClient.execute({
      sql: "UPDATE users SET name = ?, role = ?, district = ? WHERE phone = ?",
      args: [name, role, district, phone],
    });
    return { id: existing.id, name, role, district, phone };
  }

  // Create new user
  const id = uuidv4();
  await tursoClient.execute({
    sql: "INSERT INTO users (id, name, phone, role, district) VALUES (?, ?, ?, ?, ?)",
    args: [id, name, phone, role, district],
  });
  return { id, name, role, district, phone };
};

const getUserById = async (id) => {
  const result = await tursoClient.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });
  return result.rows[0] || null;
};

export { generateToken, verifyToken, findUserByPhone, createOrUpdateUser, getUserById };
