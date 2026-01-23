import User from "../../models/User.js";
import jwt from "jsonwebtoken";

export const quickRegister = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Validaciones
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Nombre y teléfono son requeridos"
      });
    }

    // Limpiar teléfono (solo números)
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "El teléfono debe tener al menos 10 dígitos"
      });
    }

    // Buscar usuario existente por teléfono
    let user = await User.findOne({ phone: cleanPhone });
    let isNewUser = false;

    if (user) {
      // Usuario existe: actualizar datos si se proporcionan
      if (name && name !== user.name) {
        user.name = name;
      }

      // Agregar nueva dirección si se proporciona y no existe
      if (address && address.street) {
        const addressExists = user.addresses.some(
          addr => addr.street === address.street &&
                  addr.coordinates?.[0] === address.coordinates?.[0] &&
                  addr.coordinates?.[1] === address.coordinates?.[1]
        );

        if (!addressExists) {
          // Si es la primera dirección, marcarla como default
          const isFirst = user.addresses.length === 0;
          user.addresses.push({
            label: address.label || "Casa",
            street: address.street,
            reference: address.reference || "",
            coordinates: address.coordinates || [],
            isDefault: isFirst
          });

          // También actualizar el campo address legacy
          if (isFirst) {
            user.address = {
              street: address.street,
              reference: address.reference || "",
              coordinates: address.coordinates || []
            };
          }
        }
      }

      await user.save();

    } else {
      // Usuario nuevo: crear
      isNewUser = true;

      const userData = {
        name,
        phone: cleanPhone,
        role: "customer",
        hasPassword: false,
        addresses: [],
        address: {}
      };

      // Agregar dirección si se proporciona
      if (address && address.street) {
        userData.addresses = [{
          label: address.label || "Casa",
          street: address.street,
          reference: address.reference || "",
          coordinates: address.coordinates || [],
          isDefault: true
        }];

        userData.address = {
          street: address.street,
          reference: address.reference || "",
          coordinates: address.coordinates || []
        };
      }

      user = await User.create(userData);
    }

    // Generar token JWT (30 días de expiración)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Preparar respuesta
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser ? `¡Bienvenido ${user.name}!` : `¡Hola de nuevo ${user.name}!`,
      user: userResponse,
      token,
      isNewUser
    });

  } catch (error) {
    console.error("Error en quick-register:", error);

    // Error de duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con ese teléfono"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al procesar el registro",
      error: error.message
    });
  }
};
