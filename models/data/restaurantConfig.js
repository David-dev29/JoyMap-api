import 'dotenv/config';
import '../../config/database.js';
import RestaurantConfig from '../RestaurantConfig.js';

let config = [
  {
    name: "KUMA",
    logo: "https://i.imgur.com/logo.png",
    coverImage: "https://i.imgur.com/cover.png",
    description: "Lo que quieres, cuando quieres.",
    address: "Av. Reforma #123",
    phone: "5551234567",
    schedule: { open: "09:00", close: "23:00" },
    isOpen: true
  }
];

RestaurantConfig.insertMany(config)
  .then(() => console.log("Restaurant config inserted"))
  .catch(err => console.log(err));
