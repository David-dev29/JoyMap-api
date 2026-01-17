import { Schema, model } from "mongoose";

let collection = "subcategories";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },

  // Relación con la categoría principal
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true
  },

  // Relación con la tienda (útil si manejas varias tiendas)
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "stores",
    required: true
  },

  // Descripción opcional
  description: {
    type: String,
    trim: true,
    maxlength: 200,
    default: null
  },

  // Imágenes asociadas
  iconUrl: {
    type: String,
    default: null // Ícono pequeño para mostrar en botones o grids
  },
  bannerUrl: {
    type: String,
    default: null // Imagen grande tipo encabezado
  },

  // Estado (por si deseas desactivar temporalmente una subcategoría)
  active: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// --- Virtual para traer productos automáticamente ---
schema.virtual("products", {
  ref: "products",          // Modelo relacionado
  localField: "_id",        // Campo en Subcategory
  foreignField: "subcategoryId" // Campo en Product que referencia Subcategory
});

// Mostrar virtuals en JSON y objetos
schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

let Subcategory = model(collection, schema);
export default Subcategory;
