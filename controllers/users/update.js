import User from "../../models/User.js";


// ✅ Actualizar usuario
let updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;

        // Validaciones
        if (phone && phone.length < 10) {
            return res.status(400).json({
                success: false,
                message: "El teléfono debe tener al menos 10 dígitos"
            });
        }

        // Buscar y actualizar
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { 
                name: name?.trim(), 
                phone: phone?.trim() 
            },
            { 
                new: true, // Devuelve el documento actualizado
                runValidators: true // Ejecuta validaciones del schema
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente",
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export default updateUser;