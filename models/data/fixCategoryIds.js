import mongoose from "mongoose";
import Product from "../Product.js"; // ajusta la ruta
import Category from "../Category.js"; // ajusta la ruta

const MONGO_URI = "mongodb+srv://Davidcm:pastes29@bddavid.gynrh.mongodb.net/ENCORTO"; // tu URI

await mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
    // 🍔 Hamburguesas
    { _id: "68afb199b3866c24207ff1f2", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f3", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f8", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f1", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f6", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1fa", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1fb", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f7", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f5", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f9", category: "hamburguesas" },
    { _id: "68afb199b3866c24207ff1f4", category: "hamburguesas" },
  
    // 🌭 Hot-dogs
    { _id: "68afb199b3866c24207ff1fe", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff206", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff1fc", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff202", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff200", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff201", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff203", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff1fd", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff1ff", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff204", category: "hot-dogs" },
    { _id: "68afb199b3866c24207ff205", category: "hot-dogs" },
  
    // 🥖 Semitas
    { _id: "68afb199b3866c24207ff20c", category: "semitas" },
    { _id: "68afb199b3866c24207ff208", category: "semitas" },
    { _id: "68afb199b3866c24207ff20e", category: "semitas" },
    { _id: "68afb199b3866c24207ff20f", category: "semitas" },
    { _id: "68afb199b3866c24207ff20b", category: "semitas" },
    { _id: "68afb199b3866c24207ff20d", category: "semitas" },
    { _id: "68afb199b3866c24207ff210", category: "semitas" },
    { _id: "68afb199b3866c24207ff20a", category: "semitas" },
    { _id: "68afb199b3866c24207ff207", category: "semitas" },
    { _id: "68afb199b3866c24207ff209", category: "semitas" },
    { _id: "68afb199b3866c24207ff211", category: "semitas" },
  
    // 🥪 Tortas
    { _id: "68afb199b3866c24207ff215", category: "tortas" },
    { _id: "68afb199b3866c24207ff21a", category: "tortas" },
    { _id: "68afb199b3866c24207ff212", category: "tortas" },
    { _id: "68afb199b3866c24207ff219", category: "tortas" },
    { _id: "68afb199b3866c24207ff213", category: "tortas" },
    { _id: "68afb199b3866c24207ff214", category: "tortas" },
    { _id: "68afb199b3866c24207ff21c", category: "tortas" },
    { _id: "68afb199b3866c24207ff217", category: "tortas" },
    { _id: "68afb199b3866c24207ff216", category: "tortas" },
    { _id: "68afb199b3866c24207ff218", category: "tortas" },
    { _id: "68afb199b3866c24207ff21b", category: "tortas" },
  
    // 🌮 Antojitos
    { _id: "68afb199b3866c24207ff226", category: "antojitos" },
    { _id: "68afb199b3866c24207ff225", category: "antojitos" },
    { _id: "68afb199b3866c24207ff221", category: "antojitos" },
    { _id: "68afb199b3866c24207ff224", category: "antojitos" },
    { _id: "68afb199b3866c24207ff21d", category: "antojitos" },
    { _id: "68afb199b3866c24207ff21e", category: "antojitos" },
    { _id: "68afb199b3866c24207ff21f", category: "antojitos" },
    { _id: "68afb199b3866c24207ff222", category: "antojitos" },
    { _id: "68afb199b3866c24207ff220", category: "antojitos" },
    { _id: "68afb199b3866c24207ff227", category: "antojitos" },
    { _id: "68afb199b3866c24207ff223", category: "antojitos" },
  
    // 🍗 Alitas-boneless
    { _id: "68afb199b3866c24207ff22b", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff228", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff229", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff22f", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff22a", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff22c", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff232", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff22e", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff230", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff231", category: "alitas-boneless" },
    { _id: "68afb199b3866c24207ff22d", category: "alitas-boneless" },
  ];
  
  

// --- Contador de actualizaciones por categoría ---
const summary = {};

for (let p of products) {
  const categoryDoc = await Category.findOne({ name: p.category });

  if (categoryDoc) {
    const updated = await Product.findByIdAndUpdate(p._id, { categoryId: categoryDoc._id });

    if (updated) {
      console.log(`✅ Producto ${p._id} actualizado con categoryId ${categoryDoc._id}`);

      // sumamos al resumen
      if (!summary[p.category]) summary[p.category] = 0;
      summary[p.category]++;
    } else {
      console.log(`⚠️ Producto ${p._id} no encontrado en la BD`);
    }
  } else {
    console.log(`❌ Categoría no encontrada para producto ${p._id}`);
  }
}

console.log("\n📊 RESUMEN DE ACTUALIZACIONES:");
for (const [cat, count] of Object.entries(summary)) {
  console.log(`   ${cat}: ${count} productos actualizados`);
}

process.exit();
