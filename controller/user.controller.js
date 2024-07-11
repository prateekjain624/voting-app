import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      email,
      address,
      aadharCardNumber,
      password,
      role,
    } = req.body;

    //   checking for the role should be only voter
    const adminRole = await User.findOne({
      role: "admin",
    });
    if (req.body.role === "admin" && adminRole) {
      return res.status(400).json({ message: "Only voter can do voting" });
    }

    //checking for existing user
    const existingUser = await User.findOne({
      aadharCardNumber: aadharCardNumber,
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      // creating new user
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
        age: age,
        phone: phone,
        address: address,
        adharCardNumber: aadharCardNumber,
      });

      const user = await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: user });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    const user = await User.findOne({
      adharCardNumber: aadharCardNumber,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res
      .status(400)
      .json({ message: "user login successfull", token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const comparedPassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparedPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
