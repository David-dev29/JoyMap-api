import User from "../../models/User.js";

// ✅ Crear nuevo usuario
let createUser = async (req, res, next) => {
    try {
        const { name, phone } = req.body;

        // Validaciones
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

        // Verificar si el teléfono ya existe
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(200).json({
                success: true,
                message: "Usuario ya existe",
                user: existingUser
            });
        }

        // Crear nuevo usuario
        const newUser = await User.create({
            name: name.trim(),
            phone: phone.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente",
            user: newUser
        });
    } catch (error) {
        next(error);
    }
};

export default createUser;