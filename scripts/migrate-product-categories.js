import "dotenv/config";
import mongoose from "mongoose";
import readline from "readline";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ProductCategory from "../models/ProductCategory.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

// Contadores para el resumen
const stats = {
  productsAnalyzed: 0,
  productsMigrated: 0,
  categoriesCreated: 0,
  categoriesReused: 0,
  errors: 0,
  skipped: 0
};

const migrateProductCategories = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Conectado a MongoDB\n");

    // Buscar productos que tienen categoryId pero NO tienen productCategoryId
    const productsToMigrate = await Product.find({
      categoryId: { $exists: true, $ne: null },
      $or: [
        { productCategoryId: { $exists: false } },
        { productCategoryId: null }
      ]
    }).populate("categoryId", "name");

    stats.productsAnalyzed = productsToMigrate.length;

    console.log("═══════════════════════════════════════════════════════════");
    console.log("  MIGRACIÓN DE CATEGORÍAS DE PRODUCTOS");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`  Productos a migrar: ${productsToMigrate.length}`);
    console.log("═══════════════════════════════════════════════════════════\n");

    if (productsToMigrate.length === 0) {
      console.log("No hay productos para migrar.");
      console.log("Todos los productos ya tienen productCategoryId o no tienen categoryId.\n");
      process.exit(0);
    }

    // Mostrar preview de productos a migrar
    console.log("Preview de productos a migrar:");
    console.log("─────────────────────────────────────────────────────────────");

    const preview = productsToMigrate.slice(0, 10);
    for (const product of preview) {
      const categoryName = product.categoryId?.name || product.category || "Sin categoría";
      console.log(`  • ${product.name}`);
      console.log(`    Categoría: ${categoryName} | Business: ${product.businessId}`);
    }

    if (productsToMigrate.length > 10) {
      console.log(`  ... y ${productsToMigrate.length - 10} productos más`);
    }
    console.log("─────────────────────────────────────────────────────────────\n");

    // Confirmar migración
    const confirm = await question("¿Deseas continuar con la migración? (s/n): ");

    if (confirm.toLowerCase() !== "s" && confirm.toLowerCase() !== "si") {
      console.log("\nMigración cancelada.");
      process.exit(0);
    }

    console.log("\n Iniciando migración...\n");

    // Cache de ProductCategories creadas (para evitar duplicados)
    // Key: `${businessId}_${categoryName}` -> ProductCategory._id
    const categoryCache = new Map();

    // Procesar cada producto
    for (let i = 0; i < productsToMigrate.length; i++) {
      const product = productsToMigrate[i];

      try {
        // Obtener el nombre de la categoría
        let categoryName = null;

        if (product.categoryId && product.categoryId.name) {
          // Tiene el populate
          categoryName = product.categoryId.name;
        } else if (product.category) {
          // Usar el campo desnormalizado
          categoryName = product.category;
        } else if (product.categoryId) {
          // Buscar la categoría manualmente
          const oldCategory = await Category.findById(product.categoryId);
          categoryName = oldCategory?.name;
        }

        if (!categoryName) {
          console.log(`  [SKIP] ${product.name} - No se encontró nombre de categoría`);
          stats.skipped++;
          continue;
        }

        if (!product.businessId) {
          console.log(`  [SKIP] ${product.name} - No tiene businessId`);
          stats.skipped++;
          continue;
        }

        const cacheKey = `${product.businessId}_${categoryName.toLowerCase().trim()}`;
        let productCategoryId = categoryCache.get(cacheKey);

        if (!productCategoryId) {
          // Buscar si ya existe una ProductCategory con ese nombre para ese negocio
          let existingCategory = await ProductCategory.findOne({
            businessId: product.businessId,
            name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
          });

          if (existingCategory) {
            productCategoryId = existingCategory._id;
            categoryCache.set(cacheKey, productCategoryId);
            stats.categoriesReused++;
          } else {
            // Crear nueva ProductCategory
            const newCategory = new ProductCategory({
              name: categoryName,
              businessId: product.businessId,
              description: '',
              icon: '',
              image: '',
              order: stats.categoriesCreated,
              isActive: true
            });

            await newCategory.save();
            productCategoryId = newCategory._id;
            categoryCache.set(cacheKey, productCategoryId);
            stats.categoriesCreated++;

            console.log(`  [NEW] Categoría creada: "${categoryName}" para business ${product.businessId}`);
          }
        }

        // Actualizar el producto
        await Product.findByIdAndUpdate(product._id, {
          productCategoryId: productCategoryId
        });

        stats.productsMigrated++;

        // Mostrar progreso cada 50 productos
        if ((i + 1) % 50 === 0 || i === productsToMigrate.length - 1) {
          const percent = Math.round(((i + 1) / productsToMigrate.length) * 100);
          console.log(`  Progreso: ${i + 1}/${productsToMigrate.length} (${percent}%)`);
        }

      } catch (error) {
        console.error(`  [ERROR] ${product.name}: ${error.message}`);
        stats.errors++;
      }
    }

    // Resumen final
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("  MIGRACIÓN COMPLETADA");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`  Productos analizados:    ${stats.productsAnalyzed}`);
    console.log(`  Productos migrados:      ${stats.productsMigrated}`);
    console.log(`  Categorías creadas:      ${stats.categoriesCreated}`);
    console.log(`  Categorías reutilizadas: ${stats.categoriesReused}`);
    console.log(`  Productos saltados:      ${stats.skipped}`);
    console.log(`  Errores:                 ${stats.errors}`);
    console.log("═══════════════════════════════════════════════════════════\n");

    // Verificar productos restantes
    const remaining = await Product.countDocuments({
      categoryId: { $exists: true, $ne: null },
      $or: [
        { productCategoryId: { $exists: false } },
        { productCategoryId: null }
      ]
    });

    if (remaining > 0) {
      console.log(`Advertencia: Aún quedan ${remaining} productos sin productCategoryId`);
    } else {
      console.log("Todos los productos con categoryId ahora tienen productCategoryId.");
    }

    // Mostrar resumen de categorías por negocio
    console.log("\n─────────────────────────────────────────────────────────────");
    console.log("CATEGORÍAS CREADAS POR NEGOCIO:");
    console.log("─────────────────────────────────────────────────────────────");

    const categoriesByBusiness = await ProductCategory.aggregate([
      {
        $group: {
          _id: "$businessId",
          categories: { $push: "$name" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "businesses",
          localField: "_id",
          foreignField: "_id",
          as: "business"
        }
      },
      { $unwind: { path: "$business", preserveNullAndEmptyArrays: true } }
    ]);

    for (const item of categoriesByBusiness) {
      const businessName = item.business?.name || `ID: ${item._id}`;
      console.log(`\n  ${businessName} (${item.count} categorías):`);
      item.categories.forEach(cat => console.log(`    • ${cat}`));
    }

    console.log("\n─────────────────────────────────────────────────────────────\n");

    rl.close();
    process.exit(0);

  } catch (error) {
    console.error("\nError en migración:", error.message);
    console.error(error.stack);
    rl.close();
    process.exit(1);
  }
};

migrateProductCategories();
