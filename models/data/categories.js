import 'dotenv/config';
import '../../config/database.js';
import Category from '../Category.js';
import mongoose from 'mongoose';

const storeId = new mongoose.Types.ObjectId("68bf9b9665affa1a7e26510f"); // ✅ ObjectId válido

const categoriesData = [
  { name: "Hamburguesas", products: [], storeId },
  { name: "Hot Dogs", products: [], storeId },
  { name: "Semitas", products: [], storeId },
  { name: "Tortas", products: [], storeId },
  { name: "Antojitos", products: [], storeId },
  { name: "Alitas y Boneless", products: [], storeId }
];

Category.insertMany(categoriesData)
  .then(() => console.log("Categories inserted"))
  .catch(err => console.log(err));
