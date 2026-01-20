import User from "../../models/User.js";
import bcrypt from "bcrypt";

// Crear nuevo usuario (solo admin puede asignar roles especiales)
const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, businessId } = req.body;

    // Validaciones básicas
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Nombre y teléfono son requeridos"
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "El teléfono debe tener al menos 10 dígitos"
      });
    }

    // Solo admin puede asignar roles especiales
    if (role && role !== "customer") {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Solo admin puede crear usuarios con roles especiales"
        });
      }
    }

    // Verificar si el teléfono ya existe
    const existingUser = await User.findOne({
      $or: [{ phone }, ...(email ? [{ email }] : [])]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con ese teléfono o email"
      });
    }

    // Preparar datos del usuario
    const userData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      role: role || "customer"
    };

    // Si viene password, hashearlo
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "La contraseña debe tener al menos 6 caracteres"
        });
      }
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    // Si es business_owner, asignar negocio
    if (role === "business_owner" && businessId) {
      userData.businessId = businessId;
    }

    // Crear usuario
    const newUser = await User.create(userData);

    // Respuesta sin password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export default createUser;
