import User from "../../models/User.js";

// GET /api/me/profile - Obtener mi perfil
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("businessId", "name logo");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error getMyProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil",
      error: error.message
    });
  }
};

// PUT /api/me/profile - Actualizar mi perfil
export const updateMyProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Solo permitir actualizar ciertos campos
    const allowedUpdates = {};
    if (name) allowedUpdates.name = name.trim();
    if (email) allowedUpdates.email = email.trim();
    if (phone) allowedUpdates.phone = phone.trim();
    if (address) allowedUpdates.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Perfil actualizado",
      user
    });
  } catch (error) {
    console.error("Error updateMyProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar perfil",
      error: error.message
    });
  }
};
