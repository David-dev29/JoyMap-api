import Subcategory from "../../models/Subcategory.js";

export default async function deleteSubcategory(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Subcategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Subcategoría no encontrada." });
    }

    return res.status(200).json({ message: "Subcategoría eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar subcategoría:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
