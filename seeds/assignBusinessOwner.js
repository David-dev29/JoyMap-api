import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Business from "../models/Business.js";

const assignBusinessOwner = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Conectado a MongoDB");

    // Obtener argumentos
    const businessId = process.argv[2];
    const userId = process.argv[3];

    if (!businessId || !userId) {
      console.error("Uso: npm run assign-owner <businessId> <userId>");
      console.error("Ejemplo: npm run assign-owner 507f1f77bcf86cd799439011 507f1f77bcf86cd799439012");
      process.exit(1);
    }

    // Verificar que el usuario existe y tiene rol business_owner
    const user = await User.findById(userId);
    if (!user) {
      console.error("Usuario no encontrado");
      process.exit(1);
    }

    if (user.role !== "business_owner") {
      console.log(`Actualizando rol del usuario a business_owner...`);
      user.role = "business_owner";
    }

    // Verificar que el negocio existe
    const business = await Business.findById(businessId);
    if (!business) {
      console.error("Negocio no encontrado");
      process.exit(1);
    }

    // Asignar owner al negocio
    business.owner = userId;
    await business.save();

    // Asignar businessId al usuario
    user.businessId = businessId;
    await user.save();

    console.log("Asignación exitosa:");
    console.log(`   Usuario: ${user.name} (${user.email})`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Negocio: ${business.name}`);
    console.log(`   Business ID: ${business._id}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

assignBusinessOwner();
