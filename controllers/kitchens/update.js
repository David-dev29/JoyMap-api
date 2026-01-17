import Kitchen from "../../models/Kitchen.js";
import { io } from "../../server.js"; // 🔹 Importa la instancia de Socket.IO

// Actualizar cocina
export const updateKitchen = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await Kitchen.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Cocina no encontrada" });
    }

    // 🔹 Emitir actualización a todos los clientes conectados
    io.emit("kitchenUpdated", {
        kitchenId: updated._id,
        kitchen: updated, // 👈 aquí mandas toda la cocina actualizada
      });
    res.json(updated);
    
  } catch (error) {
    console.error("Error actualizando cocina:", error);
    res.status(500).json({ message: "Error actualizando cocina" });
  }
};
