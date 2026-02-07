// controllers/category/deleteCategory.js
import CategoryBusiness from "../../models/CategoryBusiness.js";

export const deleteCategoryBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryBusiness.findByIdAndUpdate(id, { isActive: false }, { new: true });

    res.json({ success: true, response: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar categoría" });
  }
};
