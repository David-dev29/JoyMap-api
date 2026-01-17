import "dotenv/config";
import "../../config/database.js";
import CategoryBusiness from "../CategoryBusiness.js";

const categories = [
  {
    name: "Pizzerías",
    slug: "pizzerias",
    icon: "🍕",
    isActive: true
  },
  {
    name: "Hamburguesas",
    slug: "hamburguesas",
    icon: "🍔",
    isActive: true
  },
  {
    name: "Panaderías",
    slug: "panaderias",
    icon: "🥐",
    isActive: true
  },
  {
    name: "Tacos",
    slug: "tacos",
    icon: "🌮",
    isActive: true
  },
  {
    name: "Alitas & Boneless",
    slug: "alitas-boneless",
    icon: "🍗",
    isActive: true
  }
];

CategoryBusiness.insertMany(categories)
  .then(() => {
    console.log("✅ Categories inserted correctly");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error inserting categories", err);
    process.exit(1);
  });
