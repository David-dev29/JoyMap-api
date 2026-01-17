import { Schema, model } from "mongoose";

let collection = "products";

const schema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true,
    default: ''
  },
  price: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String,
    default: ''
  },
  // 🆕 Campo para el nombre de la categoría (desnormalizado para queries rápidas)
  category: {
    type: String,
    trim: true,
    default: ''
  },
  // Relación con la categoría a la que pertenece este producto
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: false
  },
  // Nombre de la subcategoría (legacy/cache)
  subcategory: {
    type: String,
    trim: true,
    default: 'Clásicos'
  },
  // ID de la subcategoría (relación)
  subcategoryId: {
    type: Schema.Types.ObjectId,
    ref: "subcategories",
    default: null
  },  
  availability: { 
    type: String, 
    enum: ['Disponible', 'No disponible', 'Agotado'], 
    default: 'Disponible' 
  },
  stockControl: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0
  },
  kitchenId: {
    type: Schema.Types.ObjectId,
    ref: 'kitchens',
    required: false
  },
  kitchen: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// 🆕 Middleware pre-save para sincronizar category name con categoryId
schema.pre('save', async function(next) {
  if (this.isModified('categoryId') && this.categoryId) {
    try {
      const Category = model('categories');
      const category = await Category.findById(this.categoryId);
      if (category) {
        this.category = category.name;
      }
    } catch (error) {
      console.error('Error sincronizando category:', error);
    }
  }
  next();
});

let Product = model(collection, schema);
export default Product;