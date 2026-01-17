import mongoose from "mongoose";
import 'dotenv/config';
import Product from "../Product.js"; // Ajusta la ruta si es necesario

// Conexión a MongoDB
mongoose.connect(process.env.URI_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar:", err));

const migrateImages = async () => {
  try {
    const result = await Product.updateMany(
      { imageUrl: { $exists: true } }, // productos que aún tienen imageUrl
      [
        { $set: { image: "$imageUrl" } }, // copiar imageUrl a image
        { $unset: "imageUrl" }           // eliminar imageUrl
      ]
    );

    console.log(`✨ Migración completada. Documentos modificados: ${result.modifiedCount}`);
  } catch (err) {
    console.error("❌ Error durante la migración:", err);
  } finally {
    mongoose.disconnect();
  }
};

migrateImages();
