import Product from "../../models/Product.js";

export const allProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, response: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const oneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) 
      return res.status(404).json({ success: false, message: "Producto no encontrado" });

    res.json({ success: true, response: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
