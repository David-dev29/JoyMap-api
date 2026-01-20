import "dotenv/config";
import mongoose from "mongoose";
import readline from "readline";
import Product from "../models/Product.js";
import Business from "../models/Business.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

const migrateProductsBusiness = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Conectado a MongoDB\n");

    // Buscar productos sin businessId
    const productsWithoutBusiness = await Product.find({
      $or: [
        { businessId: { $exists: false } },
        { businessId: null }
      ]
    });

    console.log(`Productos sin businessId: ${productsWithoutBusiness.length}`);

    if (productsWithoutBusiness.length === 0) {
      console.log("No hay productos para migrar.");
      process.exit(0);
    }

    // Mostrar lista de productos afectados
    console.log("\nProductos a migrar:");
    productsWithoutBusiness.slice(0, 10).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p._id})`);
    });
    if (productsWithoutBusiness.length > 10) {
      console.log(`  ... y ${productsWithoutBusiness.length - 10} más`);
    }

    // Buscar negocios disponibles
    const businesses = await Business.find({ isActive: true }).select("name _id");

    if (businesses.length === 0) {
      console.error("\nNo hay negocios disponibles. Crea uno primero.");
      process.exit(1);
    }

    console.log("\n═══════════════════════════════════════════");
    console.log("NEGOCIOS DISPONIBLES:");
    console.log("═══════════════════════════════════════════");
    businesses.forEach((b, i) => {
      console.log(`  [${i + 1}] ${b.name} (${b._id})`);
    });
    console.log("═══════════════════════════════════════════\n");

    // Verificar si viene businessId como argumento
    let selectedBusinessId = process.argv[2];

    if (!selectedBusinessId) {
      // Pedir selección al usuario
      const selection = await question(
        `Selecciona un negocio [1-${businesses.length}] o escribe el ID directamente: `
      );

      // Verificar si es un número (índice) o un ID
      const index = parseInt(selection);
      if (!isNaN(index) && index >= 1 && index <= businesses.length) {
        selectedBusinessId = businesses[index - 1]._id.toString();
      } else if (selection.length === 24) {
        // Parece un ObjectId
        selectedBusinessId = selection;
      } else {
        console.error("Selección inválida");
        process.exit(1);
      }
    }

    // Verificar que el negocio existe
    const targetBusiness = await Business.findById(selectedBusinessId);
    if (!targetBusiness) {
      console.error(`Negocio con ID ${selectedBusinessId} no encontrado`);
      process.exit(1);
    }

    console.log(`\nNegocio seleccionado: ${targetBusiness.name}`);

    // Confirmar migración
    const confirm = await question(
      `\n¿Asignar ${productsWithoutBusiness.length} productos a "${targetBusiness.name}"? (s/n): `
    );

    if (confirm.toLowerCase() !== "s" && confirm.toLowerCase() !== "si") {
      console.log("Migración cancelada");
      process.exit(0);
    }

    // Ejecutar migración
    console.log("\nMigrando productos...");

    const result = await Product.updateMany(
      {
        $or: [
          { businessId: { $exists: false } },
          { businessId: null }
        ]
      },
      {
        $set: { businessId: selectedBusinessId }
      }
    );

    console.log(`\n════════════════════════════════════════`);
    console.log(`MIGRACIÓN COMPLETADA`);
    console.log(`════════════════════════════════════════`);
    console.log(`  Productos actualizados: ${result.modifiedCount}`);
    console.log(`  Negocio asignado: ${targetBusiness.name}`);
    console.log(`  Business ID: ${selectedBusinessId}`);
    console.log(`════════════════════════════════════════\n`);

    // Verificar
    const remaining = await Product.countDocuments({
      $or: [
        { businessId: { $exists: false } },
        { businessId: null }
      ]
    });

    if (remaining > 0) {
      console.log(`Advertencia: Aún quedan ${remaining} productos sin businessId`);
    } else {
      console.log("Todos los productos tienen businessId asignado.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error en migración:", error.message);
    process.exit(1);
  }
};

migrateProductsBusiness();
