import 'dotenv/config';
import '../../config/database.js';
import Order from '../Order.js';

let orders = {
    customerId: "64abc123def4567890fedcba", // ObjectId de un usuario existente
    items: [
      {
        productId: "64abc987def4567890fed123", // ObjectId de un producto
        name: "Hamburguesa Clásica",
        price: 50,
        quantity: 2
      },
      {
        productId: "64abc654def4567890fed456",
        name: "Papas Fritas",
        price: 20,
        quantity: 1
      }
    ],
    subtotal: 120,         // 50*2 + 20
    deliveryFee: 15,       // costo de envío
    total: 135,            // subtotal + deliveryFee
    status: "pending",     // valor por defecto
    statusHistory: [
      { status: "pending", timestamp: new Date() }
    ],
    deliveryAddress: {
      street: "Calle Principal 45",
      reference: "Esquina con la tienda",
      coordinates: [-98.3088, 19.0595] // [lng, lat]
    },
    deliveryPerson: null,  // aún no asignado
    paymentMethod: "cash",
    paymentStatus: "pending",
    notes: "Tocar el timbre dos veces"
  };
  

Order.insertMany(orders)
  .then(() => console.log("Orders inserted"))
  .catch(err => console.log(err));
