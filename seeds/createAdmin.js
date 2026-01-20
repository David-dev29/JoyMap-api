import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Conectado a MongoDB");

    // Obtener datos de argumentos o variables de entorno
    const email = process.argv[2] || process.env.ADMIN_EMAIL;
    const password = process.argv[3] || process.env.ADMIN_PASSWORD;
    const name = process.argv[4] || process.env.ADMIN_NAME || "Admin";

    if (!email || !password) {
      console.error("Uso: npm run create-admin <email> <password> [name]");
      console.error("   O define ADMIN_EMAIL y ADMIN_PASSWORD en .env");
      process.exit(1);
    }

    // Verificar si ya existe
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.error("Ya existe un usuario con ese email");
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear admin
    const admin = await User.create({
      name,
      email,
      phone: "0000000000",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin creado exitosamente:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nombre: ${admin.name}`);
    console.log(`   Rol: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
