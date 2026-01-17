import { Schema, model } from "mongoose";

let collection = "stores";

const schema = new Schema({
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 45
  },
  logoUrl: {
    type: String,
    default: ''
  },
  bannerUrl: {
    type: String,
    default: ''
  },
  // ✨ NUEVO: Logo tipográfico para el header
  textLogoUrl: {
    type: String,
    default: ''
  },
  // Relación con las categorías que pertenecen a esta tienda
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'categories'
  }]
}, {
  timestamps: true
});

let Store = model(collection, schema);
export default Store;