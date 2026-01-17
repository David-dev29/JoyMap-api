import User from "../../models/User.js";


// ✅ Eliminar usuario
let deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado exitosamente",
            user: deletedUser
        });
    } catch (error) {
        next(error);
    }
};
 export default deleteUser;