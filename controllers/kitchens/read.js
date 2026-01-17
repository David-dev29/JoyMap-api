import Kitchen from "../../models/Kitchen.js";


// Obtener todas las cocinas de una tienda
export const allKitchens = async (req, res) => {
    try {
      const { storeId } = req.query; // 👈 ahora lo lees del query
      const filter = storeId ? { storeId } : {};
      const kitchens = await Kitchen.find(filter).populate("products");
      res.json(kitchens);
    } catch (error) {
      console.error("Error obteniendo cocinas:", error);
      res.status(500).json({ message: "Error obteniendo cocinas" });
    }
  };
  
  
  // Obtener cocina por ID
  export const KitchenById = async (req, res) => {
    try {
      const { id } = req.params;
      const kitchen = await Kitchen.findById(id).populate("products");
  
      if (!kitchen) {
        return res.status(404).json({ message: "Cocina no encontrada" });
      }
  
      res.json(kitchen);
    } catch (error) {
      console.error("Error obteniendo cocina:", error);
      res.status(500).json({ message: "Error obteniendo cocina" });
    }
  };