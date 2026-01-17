import Kitchen from "../../models/Kitchen.js";


// Crear cocina
export const createKitchen = async (req, res) => {
  try {
    const { name, storeId } = req.body;

    if (!name || !storeId) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const newKitchen = await Kitchen.create({ name, storeId });
    res.status(201).json(newKitchen);
  } catch (error) {
    console.error("Error creando cocina:", error);
    res.status(500).json({ message: "Error creando cocina" });
  }
};