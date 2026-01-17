import Kitchen from "../../models/Kitchen.js";

// Eliminar solo la cocina (sin tocar productos)
export const deleteKitchen = async (req, res) => {
  try {
    const { id } = req.params;

    const kitchen = await Kitchen.findByIdAndDelete(id);

    if (!kitchen) {
      return res.status(404).json({ message: "Cocina no encontrada" });
    }

    res.json({ message: "Cocina eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando cocina:", error);
    res.status(500).json({ message: "Error eliminando cocina" });
  }
};
