import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../db";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db("users")
      .insert({
        username,
        email,
        password: hashedPassword,
      })
      .returning(["id", "email", "username"]);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", user, token });
  } catch (error: any) {
    console.error(error);
    if (error.code === '23505') {
      if (error.constraint === 'users_email_unique') {
        return res.status(400).json({ error: "Email already in use" });
      }
      if (error.constraint === 'users_username_unique') {
        return res.status(400).json({ error: "Username already in use" });
      }
    }
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;
    let user = await db("users").where({ email: usernameOrEmail }).first();
    
    if (!user) {
      user = await db("users").where({ username: usernameOrEmail }).first();
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};

export const checkEmail = async (req: Request, res: Response) => {
  try {
    console.log('checkEmail function called');
    console.log('Request body:', req.body);
    const { email } = req.body;
    const user = await db("users").where({ email }).first();
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error in checkEmail:', error);
    res.status(500).json({ error: 'An error occurred while checking the email' });
  }
};
