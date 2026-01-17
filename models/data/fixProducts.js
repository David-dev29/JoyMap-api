import 'dotenv/config';
import '../../config/database.js';
import Product from '../Product.js';
import Category from '../Category.js';

// ID de tu tienda principal
const STORE_ID = '68bf9b9665affa1a7e26510f';

// Función para normalizar strings (minúsculas, sin tildes, sin espacios extras)
const normalizeString = str =>
  str
    ? str
        .normalize('NFD') // descompone letras con acento
        .replace(/[\u0300-\u036f]/g, '') // quita tildes
        .trim()
        .toLowerCase()
    : '';

// Aquí defines a qué categoría pertenece cada producto
const categoryMapping = {
    "la dorada": "Hamburguesas",
    "sencilla kuma": "Hamburguesas",
    "papas a la francesa kuma": "Complementos",
    "tradicional": "Hamburguesas", // o la categoría que le corresponda
    "aros de cebolla": "Complementos",
    "bistec clasico": "Hamburguesas",
    "alitas clasicas": "Alitas",
    "bbq crunch": "Hamburguesas", // antes estaba como Crunch BBQ, ahora lo volteaste
    "combinada kuma": "Hamburguesas",
  };
  
const fixProductsCategoryId = async () => {
  try {
    const categories = await Category.find();
    const products = await Product.find();

    for (const product of products) {
      const normalizedName = normalizeString(product.name);
      const targetCategoryName = categoryMapping[normalizedName];

      if (!targetCategoryName) {
        console.log(`❌ Producto "${product.name}" no tiene categoría asignada en el mapping.`);
        continue;
      }

      // Buscar categoría en la base de datos
      let category = categories.find(c => normalizeString(c.name) === normalizeString(targetCategoryName));

      // Si no existe, crearla
      if (!category) {
        category = await Category.create({
          name: targetCategoryName,
          storeId: STORE_ID
        });
        console.log(`🆕 Se creó nueva categoría "${category.name}"`);
        categories.push(category);
      }

      // Asignar categoryId al producto
      product.categoryId = category._id;
      await product.save();
      console.log(`✅ Producto "${product.name}" actualizado con categoryId ${category._id}`);
    }

    console.log('🎉 ¡Actualización completada!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixProductsCategoryId();
