// models/data/fixBusinessCategories.js
import mongoose from 'mongoose';
import Business from '../Business.js';
import CategoryBusiness from '../CategoryBusiness.js';
import { config } from 'dotenv';

config();

const MONGO_URI = process.env.URI_MONGO;

if (!MONGO_URI) {
  console.error('❌ ERROR: No se encontró MONGO_URI');
  process.exit(1);
}

async function fixCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 📋 Ver estado actual
    const existingCategories = await CategoryBusiness.find({});
    console.log('📊 Categorías existentes en DB:');
    existingCategories.forEach(cat => {
      console.log(`   - "${cat.name}" (${cat.slug}) ${cat.icon}`);
    });

    const businesses = await Business.find({});
    console.log(`\n📦 Negocios encontrados: ${businesses.length}\n`);

    // 🗺️ MAPEO de nombres incorrectos → nombres correctos
    const categoryNameMapping = {
      'Pizza': 'Pizzerías',
      'Pizzeria': 'Pizzerías',
      'Pizzería': 'Pizzerías',
      'Hamburguesa': 'Hamburguesas',
      'Panaderia': 'Panaderías',
      'Panadería': 'Panaderías',
      'Pan': 'Panaderías',
      'Taco': 'Tacos',
      'Taqueria': 'Tacos',
      'Taquería': 'Tacos',
      'Cafe': 'Cafeterías',
      'Café': 'Cafeterías',
      'Cafeteria': 'Cafeterías',
      'Alitas': 'Alitas & Boneless',
      'Boneless': 'Alitas & Boneless',
    };

    // 🆕 Categorías que pueden faltar
    const categoriesToEnsure = [
      { name: 'Cafeterías', slug: 'cafeterias', icon: '☕' },
      { name: 'Restaurantes', slug: 'restaurantes', icon: '🍽️' },
    ];

    // Crear categorías faltantes
    for (const catData of categoriesToEnsure) {
      const exists = await CategoryBusiness.findOne({ name: catData.name });
      if (!exists) {
        await CategoryBusiness.create(catData);
        console.log(`✅ Categoría creada: ${catData.name} ${catData.icon}`);
      }
    }

    console.log('\n🔧 Procesando negocios...\n');

    // Procesar cada negocio
    for (const business of businesses) {
      const currentCategory = business.category;
      console.log(`📍 ${business.name}`);
      console.log(`   Categoría actual: "${currentCategory}" (${typeof currentCategory})`);

      let targetCategoryName;

      // Si es string, necesitamos convertirlo
      if (typeof currentCategory === 'string') {
        // Buscar en el mapeo
        targetCategoryName = categoryNameMapping[currentCategory] || currentCategory;
        console.log(`   → Mapear a: "${targetCategoryName}"`);
      } 
      // Si es ObjectId, verificar si es válido
      else if (mongoose.Types.ObjectId.isValid(currentCategory)) {
        const existingCat = await CategoryBusiness.findById(currentCategory);
        if (existingCat) {
          console.log(`   ✅ Ya tiene ObjectId válido: ${existingCat.name}`);
          continue; // Ya está correcto
        } else {
          console.log(`   ⚠️  ObjectId inválido, necesita corrección`);
          // Adivinar por el nombre del negocio
          targetCategoryName = guessCategoryFromBusinessName(business.name);
          console.log(`   🔮 Estimado por nombre: "${targetCategoryName}"`);
        }
      } else {
        console.log(`   ⚠️  Formato desconocido`);
        targetCategoryName = guessCategoryFromBusinessName(business.name);
        console.log(`   🔮 Estimado por nombre: "${targetCategoryName}"`);
      }

      // Buscar la categoría en la DB
      let categoryDoc = await CategoryBusiness.findOne({ name: targetCategoryName });

      if (!categoryDoc) {
        console.log(`   ❌ Categoría "${targetCategoryName}" no existe en DB`);
        console.log(`   💡 Usando "Restaurantes" como fallback`);
        categoryDoc = await CategoryBusiness.findOne({ name: 'Restaurantes' });
      }

      if (categoryDoc) {
        business.category = categoryDoc._id;
        await business.save();
        console.log(`   ✅ Actualizado → ${categoryDoc.name} (${categoryDoc.slug}) ${categoryDoc.icon}\n`);
      } else {
        console.log(`   ❌ ERROR: No se pudo asignar categoría\n`);
      }
    }

    console.log('═══════════════════════════════════════');
    console.log('🎉 Migración completada');
    console.log('═══════════════════════════════════════\n');

    // Verificación final
    console.log('📊 Verificación final:\n');
    const updatedBusinesses = await Business.find({}).populate('category');
    
    let successCount = 0;
    let failCount = 0;

    updatedBusinesses.forEach(b => {
      if (b.category && b.category.name) {
        console.log(`✅ ${b.name}`);
        console.log(`   → ${b.category.name} (${b.category.slug}) ${b.category.icon}\n`);
        successCount++;
      } else {
        console.log(`❌ ${b.name}: SIN CATEGORÍA\n`);
        failCount++;
      }
    });

    console.log('═══════════════════════════════════════');
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Fallidos: ${failCount}`);
    console.log('═══════════════════════════════════════');

    await mongoose.disconnect();
    console.log('\n👋 Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

function guessCategoryFromBusinessName(businessName) {
  const name = businessName.toLowerCase();
  
  if (name.includes('pizza')) return 'Pizzerías';
  if (name.includes('hamburgues')) return 'Hamburguesas';
  if (name.includes('panade') || name.includes('pan ')) return 'Panaderías';
  if (name.includes('café') || name.includes('cafe')) return 'Cafeterías';
  if (name.includes('taco') || name.includes('taquer')) return 'Tacos';
  if (name.includes('alitas') || name.includes('boneless')) return 'Alitas & Boneless';
  
  return 'Restaurantes';
}

fixCategories();