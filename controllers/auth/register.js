import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validaciones
    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre, teléfono y contraseña son requeridos"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "El teléfono debe tener al menos 10 dígitos"
      });
    }

    // Verificar si ya existe
    const existingUser = await User.findOne({
      $or: [{ phone }, ...(email ? [{ email }] : [])]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con ese teléfono o email"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario (siempre como customer en registro público)
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "customer"
    });

    // Generar token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Respuesta sin password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message
    });
  }
};
