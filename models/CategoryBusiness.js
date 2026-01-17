// models/CategoryBusiness.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, // Ya crea índice automáticamente
    trim: true,
    lowercase: true
  },
  icon: { 
    type: String, 
    default: "🍽️" 
  },
  type: { 
    type: String, 
    enum: ['comida', 'tienda', 'envio'],
    required: false,
    default: 'comida'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, {
  timestamps: true,
  collection: "categorybusinesses"
});

// Índice compuesto para mejorar queries (sin duplicar slug)
categorySchema.index({ type: 1, isActive: 1 });


export default mongoose.model("CategoryBusiness", categorySchema);