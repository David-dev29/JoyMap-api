import CategoryBusiness from "../../models/CategoryBusiness.js";

export const getCategoriesBusiness = async (req, res) => {
  try {
    const categories = await CategoryBusiness.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      response: categories
    });

  } catch (error) {
    console.error("❌ getCategoriesBusiness:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías"
    });
  }
};


export const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params; // comida, tienda, envio

    // Validar tipo
    if (!['comida', 'tienda', 'envio'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Tipo inválido. Debe ser: comida, tienda o envio"
      });
    }

    const categories = await CategoryBusiness.find({ 
      isActive: true,
      type: type
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      type: type,
      response: categories
    });

  } catch (error) {
    console.error("❌ getCategoriesByType:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías"
    });
  }
};
