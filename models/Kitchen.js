import { Schema, model } from "mongoose";

let collection = "kitchens";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  // Relación con la tienda a la que pertenece esta cocina
  storeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'stores',
    required: false
  }
}, {
  timestamps: true
});

// --- Virtual para traer productos automáticamente ---
schema.virtual('products', {
  ref: 'products',        // Modelo que vamos a poblar
  localField: '_id',      // Campo de Kitchen
  foreignField: 'kitchenId' // Campo de Product que referencia a Kitchen
});

// Esto asegura que los virtuals aparezcan en JSON
schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });

let Kitchen = model(collection, schema);
export default Kitchen;
