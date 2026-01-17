import 'dotenv/config';
import '../../config/database.js';
import User from '../User.js';

let users = [
  {
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "5551234567",
    password: "hashedpassword1", // En producción debe estar hasheada
    address: {
      street: "Calle 10 #123",
      reference: "Frente a la tienda",
      coordinates: [-98.3060, 19.0605]
    },
    role: "customer"
  },
  {
    name: "María López",
    email: "maria@example.com",
    phone: "5559876543",
    password: "hashedpassword2",
    address: {
      street: "Av. Central #45",
      reference: "Cerca del parque",
      coordinates: [-98.3075, 19.0589]
    },
    role: "customer"
  },
  {
    name: "Carlos Delivery",
    email: "carlos.delivery@example.com",
    phone: "5552223344",
    password: "hashedpassword3",
    role: "delivery"
  },
  {
    name: "Admin Restaurant",
    email: "admin@example.com",
    phone: "5551112233",
    password: "hashedpassword4",
    role: "admin"
  }
];

User.insertMany(users)
  .then(() => console.log("Users inserted"))
  .catch(err => console.log(err));
