import Subcategory from "../../models/Subcategory.js";

export default async function updateSubcategory(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Subcategory.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Subcategoría no encontrada." });
    }

    return res.status(200).json({
      message: "Subcategoría actualizada con éxito.",
      subcategory: updated
    });
  } catch (error) {
    console.error("Error al actualizar subcategoría:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
