const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/client");

const registerUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }

    if (!["DOCTOR", "PATIENT"].includes(role)) {

      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });

    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "PATIENT") {

      await prisma.patient.create({
        data: {
          userId: user.id,
          age: 0,
          gender: "Not Added",
          bloodGroup: "Not Added",
          doctorId: null,
        },
      });

    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

module.exports = {
  registerUser,
  loginUser,
};
