import mongoose from 'mongoose';
import dotenv from 'dotenv';  // ✅ AGREGAR ESTO
import CategoryBusiness from '../CategoryBusiness.js';

// ✅ CARGAR VARIABLES DE ENTORNO
dotenv.config();

const MONGO_URI = process.env.URI_MONGO;

async function fixCategories() {
  try {
    // ✅ Verificar que la URI existe
    if (!MONGO_URI) {
      console.error('❌ Error: URI_MONGO no está definida en .env');
      process.exit(1);
    }

    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const result = await CategoryBusiness.updateMany(
      { type: { $exists: false } },
      { $set: { type: 'comida' } }
    );

    console.log(`✅ ${result.modifiedCount} categorías actualizadas`);

    const allCategories = await CategoryBusiness.find({}, 'name type icon');
    console.log('\n📋 Categorías:');
    allCategories.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} → ${cat.type}`);
    });

    await mongoose.disconnect();
    console.log('\n🎉 Completado');

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixCategories();