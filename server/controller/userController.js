import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import sendToken from "../utils/sendToken.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(400).json({
        message: "User does not exist! Please register",
      });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({
        status: "Error",
        message: "Password does not match",
      });
    }

    // Generate JWT token
    const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    sendToken(user, 200, token, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // Handle server error
  }
};

const signup = async (req, res) => {
  // console.log(req.body);

  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({
      status: "Error",
      message: "Email or Password not provided",
    });
  }
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "Error",
        message: "User already exists! Please login",
      });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    user = await User.create({ email, password: hashPassword, name });

    // Generate JWT token
    const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    sendToken(user, 200, token, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getUser = async (req, res) => {
  try {
    const user= req.body.user;
    // Respond with user data
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


const updateUser = async (req, res) => {
  try {
    let user = req.body.user;
    user = await User.findByIdAndUpdate(user.id,req.body,{new:true});

    // Respond with success message and updated user data
    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // Handle server error
  }
};


const deleteUser = async (req, res) => {
  try {

    let user = req.body.user;
    await User.findByIdAndDelete(user.id);

    // Respond with success message
    res.json({
      status:"Success",
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); 
  }
};


export default { login, signup, getUser, updateUser, deleteUser };
