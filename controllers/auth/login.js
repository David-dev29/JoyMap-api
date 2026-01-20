import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    // Validar que venga phone o email
    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: "Teléfono o email requerido"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Contraseña requerida"
      });
    }

    // Buscar usuario por phone o email
    const query = phone ? { phone } : { email };
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Respuesta sin password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en login",
      error: error.message
    });
  }
};
