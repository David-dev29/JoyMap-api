import Product from "../../models/Product.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";

export const createProduct = async (req, res) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    const { 
      name, 
      description, 
      price, 
      kitchenId,   // 👈 ahora recibimos el ID
      kitchen,     // 👈 y el nombre
      availability, 
      stockControl, 
      categoryId 
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      kitchenId,   // ✅ se guarda la referencia a la colección `kitchens`
      kitchen,     // ✅ se guarda el nombre como texto
      availability,
      stockControl: stockControl === "true" || stockControl === true,
      image: imageUrl || null,
      categoryId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);

  } catch (err) {
    console.error("ERROR createProduct:", err);
    res.status(500).json({ error: err.message });
  }
};


