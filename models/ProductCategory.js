import { Schema, model } from "mongoose";

let collection = "productcategories";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  businessId: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: true,
    index: true
  },
  icon: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual para traer productos de esta categoría
schema.virtual('products', {
  ref: 'products',
  localField: '_id',
  foreignField: 'productCategoryId'
});

// Asegurar que los virtuals aparezcan en JSON
schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });

// Index compuesto para queries frecuentes
schema.index({ businessId: 1, order: 1 });
schema.index({ businessId: 1, isActive: 1 });

let ProductCategory = model(collection, schema);
export default ProductCategory;
