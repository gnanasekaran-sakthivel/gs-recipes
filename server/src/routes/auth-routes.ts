import { Router, Request, Response } from "express";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  console.log("Login attempt for username:", req.body.username); // Add logging

  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(404).json({ message: "User not found" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      console.log(`Invalid password for user: ${username}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    const jwtKey = process.env.JWT_SECRET_KEY;
    if (!jwtKey) {
      console.error(
        `JWT_SECRET_KEY not set in environment - attempting to authenticating user: ${username}`
      );
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const token = jwt.sign({ username }, jwtKey, { expiresIn: "1h" });
    console.log(`Login successful for user: ${username}`);

    return res.json({ token });
  } catch (error) {
    console.error(
      `Error while authenticating user ${username} for login - ${JSON.stringify(
        error
      )}`
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
