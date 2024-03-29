import { Request, Response } from "express";
import User, { IUser } from "../db/userModel";
import { UploadedFile } from "express-fileupload";
import { UploadApiResponse } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretToken = process.env.access_token_secret;

export const register = async (req: Request, res: Response) => {
  try {
    const {  username, password, email, role} = req.body;


    if (!email || !password || !username  || !role) {
      res.sendStatus(400).json({message:"All fields required"});
    }

    const existingUser = await User.findOne({email});

    if (existingUser) {
      res.sendStatus(400).json({message:"user already exist"});
    }

    //saving the user data
    const user: IUser = new User({
      username,
      password: await bcrypt.hash(req.body.password, 10),
      email,
      role,
      
    });
    const savedUser = await user.save();

    console.log("User Saved:", savedUser);

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: "Registration failed" });
  }
};

//login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Checking if the user exists
    const user = await User.findOne({ email });

    console.log(password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    // Checking if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generating tokens
    const accessToken = jwt.sign({userId:user._id}, (secretToken) as string, {
      expiresIn: "15m",
    });
    res.cookie("accessToken", accessToken, { httpOnly: true });

    res.json("logged in success");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};
