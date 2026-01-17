import 'dotenv/config';
import '../../config/database.js';
import Delivery from '../Delivery.js';

let deliveries = [
  {
    userId: "64abc321def4567890fedcba", // ID real del repartidor
    location: {
      type: "Point",
      coordinates: [-98.3075, 19.0589]
    },
    isAvailable: true
  }
];

Delivery.insertMany(deliveries)
  .then(() => console.log("Deliveries inserted"))
  .catch(err => console.log(err));
