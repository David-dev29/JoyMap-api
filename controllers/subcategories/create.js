import Subcategory from "../../models/Subcategory.js";

export default async function createSubcategory(req, res) {
  try {
    const { name, categoryId, storeId, description, iconUrl, bannerUrl } = req.body;

    if (!name || !categoryId || !storeId) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const newSubcategory = await Subcategory.create({
      name,
      categoryId,
      storeId,
      description,
      iconUrl,
      bannerUrl
    });

    return res.status(201).json({
      message: "Subcategoría creada con éxito.",
      subcategory: newSubcategory
    });
  } catch (error) {
    console.error("Error al crear subcategoría:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
