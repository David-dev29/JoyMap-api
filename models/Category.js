import { Schema, model } from "mongoose";

let collection = "categories";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  // Relación con la tienda a la que pertenece esta categoría
  storeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'stores',
    required: true
  },

  // 🖼️ Imágenes asociadas a la categoría
  iconUrl: {
    type: String,
    default: null, // URL del ícono
  },
  bannerUrl: {
    type: String,
    default: null, // Imagen de banner
  }

}, {
  timestamps: true
});

// --- Virtual para traer productos automáticamente ---
schema.virtual('products', {
  ref: 'products',        // Modelo que vamos a poblar
  localField: '_id',      // Campo de Category
  foreignField: 'categoryId' // Campo de Product que referencia a Category
});

// Esto asegura que los virtuals aparezcan en JSON
schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });

let Category = model(collection, schema);
export default Category;
