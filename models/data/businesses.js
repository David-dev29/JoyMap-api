import "dotenv/config";
import "../../config/database.js";
import Business from "../Business.js";

let businesses = [
  {
    name: "KUMA Burgers Centro",
    category: "hamburguesas",
    isActive: true,
    location: {
      type: "Point",
      coordinates: [-99.133209, 19.432608], // CDMX Centro
    },
  },
  {
    name: "Hot Dogs El Güero",
    category: "hot-dogs",
    isActive: true,
    location: {
      type: "Point",
      coordinates: [-99.140634, 19.430912], // Alameda
    },
  },
  {
    name: "Semitas Poblanas Doña Mary",
    category: "semitas",
    isActive: true,
    location: {
      type: "Point",
      coordinates: [-99.128998, 19.437214], // Bellas Artes
    },
  },
  {
    name: "Antojitos La Esquina",
    category: "antojitos",
    isActive: true,
    location: {
      type: "Point",
      coordinates: [-99.124533, 19.429845], // San Juan
    },
  },
  {
    name: "Alitas & Boneless Fire",
    category: "alitas-boneless",
    isActive: true,
    location: {
      type: "Point",
      coordinates: [-99.136879, 19.425921], // Juárez
    },
  },
];

Business.insertMany(businesses)
  .then(() => {
    console.log("✅ Businesses inserted correctly");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error inserting businesses", err);
    process.exit(1);
  });
