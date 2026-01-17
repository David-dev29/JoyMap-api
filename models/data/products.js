import 'dotenv/config';
import '../../config/database.js';
import Product from '../Product.js';

let products = [
    // 🍔 Hamburguesas
    { id: 101, name: "Sencilla KUMA", price: 80, image: "https://i.pinimg.com/736x/89/c5/99/89c599ca98b38f7c86c10a14f82ceec1.jpg", category: "hamburguesas", subcategory: "Clásicos", description: "La básica que nunca falla" },
    { id: 102, name: "Con Queso", price: 90, image: "https://i.pinimg.com/736x/17/51/eb/1751ebae7d5feafdd92eedacda557613.jpg", category: "hamburguesas", subcategory: "Clásicos", description: "Un clásico con extra fundido", available: true },
    { id: 103, name: "Tres Quesos KUMA", price: 120, image: "https://i.pinimg.com/1200x/0a/03/12/0a0312583b172dcc626050dc4e57d584.jpg", category: "hamburguesas", subcategory: "Especialidades", description: "Fundida, cremosa, irresistible", available: true },
    { id: 104, name: "La Picosita", price: 110, image: "https://i.pinimg.com/1200x/42/93/f7/4293f732af488539997fad48c34af0c8.jpg", category: "hamburguesas", subcategory: "Especialidades", description: "Para los que se atreven", available: true },
    { id: 105, name: "BBQ Crunch", price: 130, image: "https://i.pinimg.com/1200x/63/58/80/635880292063122eda945b02c9a83e18.jpg", category: "hamburguesas", subcategory: "Especialidades", description: "Dulce, crujiente, ahumada", available: true },
    { id: 106, name: "Papas a la francesa KUMA", price: 40, image: "https://i.pinimg.com/736x/b6/46/e1/b646e1c597c77568984a34226fae54e8.jpg", category: "hamburguesas", subcategory: "Complementos", description: "Con sal de ajo + aderezo BBQ", available: true },
    { id: 107, name: "Aros de cebolla", price: 45, image: "https://i.pinimg.com/736x/97/42/a0/9742a0cf43600c92813a8311f48d6133.jpg", category: "hamburguesas", subcategory: "Complementos", description: "Con salsa chipotle", available: true },
    { id: 301, name: "Chocoflan", price: 25, image: "https://i.pinimg.com/736x/4f/7d/d7/4f7dd739919a555b6ee20f15f03787d0.jpg", category: "hamburguesas", subcategory: "Postres", description: "Artesanal", available: true },
    { id: 302, name: "Pay de Limon", price: 20, image: "https://i.pinimg.com/1200x/01/c3/d3/01c3d3ddcbe65fd835a87619983dd90f.jpg", category: "hamburguesas", subcategory: "Postres", description: "Cremoso", available: true },
    { id: 201, name: "Refresco 500ml", price: 25, image: "https://i.pinimg.com/736x/c4/ff/01/c4ff0177106b3576220d221acb6dcd19.jpg", category: "hamburguesas", subcategory: "Bebidas", description: "Cola, limón, naranja", available: true },
    // { id: 202, name: "Agua Mineral 500ml", price: 20, image: "https://i.pinimg.com/1200x/30/3f/41/303f418d7e0bc886bccd13f7c665aadb.jpg", category: "hamburguesas", subcategory: "Bebidas", description: "Ligera y refrescante" },
    { id: 203, name: "Agua Fresca Natural", price: 30, image: "https://i.pinimg.com/1200x/6a/ea/39/6aea396a484a88df702e7721c032f019.jpg", category: "hamburguesas", subcategory: "Bebidas", description: "Horchata, Jamaica, Tamarindo", available: true },
    // { id: 204, name: "Cocteleria", price: 40, image: "https://i.pinimg.com/1200x/df/5f/52/df5f5252619abfc20bc4230dae3dd142.jpg", category: "hamburguesas", subcategory: "Bebidas", description: "Frappes, Smothies, Soda Italiana" },
  
    // 🌭 Hot Dogs
    { id: 108, name: "Tradicional", price: 60, image: "https://i.pinimg.com/1200x/53/0a/4f/530a4f28781e57b66da5d1e1a0a9c1c6.jpg", category: "hot-dogs", subcategory: "Clásicos", description: "Simple, directo, sabroso", available: true },
    { id: 109, name: "Con Queso", price: 70, image: "https://i.pinimg.com/1200x/44/c4/69/44c469288361e3d1bb3697eadf2c9c5f.jpg", category: "hot-dogs", subcategory: "Clásicos", description: "El clásico con extra cariño", available: true },
    { id: 110, name: "Crunch BBQ", price: 85, image: "https://i.pinimg.com/736x/5a/a8/7a/5aa87a9349f68b3b61028e903fad1717.jpg", category: "hot-dogs", subcategory: "Especialidades", description: "Crujiente y adictivo", available: true },
    { id: 111, name: "Guacamole Express", price: 90, image: "https://i.pinimg.com/1200x/a9/2c/03/a92c0309fb31d474473549b356652ddd.jpg", category: "hot-dogs", subcategory: "Especialidades", description: "Fresco y cremoso", available: true },
    { id: 112, name: "La Picosita Dog", price: 95, image: "https://i.pinimg.com/736x/29/5d/75/295d7599bde3a6bbd0f6a9d7928ea5a1.jpg", category: "hot-dogs", subcategory: "Especialidades", description: "Con el picor que enamora", available: true },
    { id: 113, name: "Papas a la francesa con queso", price: 50, image: "https://i.pinimg.com/736x/b6/46/e1/b646e1c597c77568984a34226fae54e8.jpg", category: "hot-dogs", subcategory: "Complementos", description: "Queso derretido", available: true },
    { id: 114, name: "Mini nachos", price: 55, image: "https://i.pinimg.com/1200x/6e/e4/81/6ee481256cca373b881089d6ef636ce2.jpg", category: "hot-dogs", subcategory: "Complementos", description: "Con queso y jalapeño", available: true },
    { id: 303, name: "Chocoflan", price: 25, image: "https://i.pinimg.com/736x/4f/7d/d7/4f7dd739919a555b6ee20f15f03787d0.jpg", category: "hot-dogs", subcategory: "Postres", description: "Artesanal", available: true },
    { id: 304, name: "Pay de Limon", price: 20, image: "https://i.pinimg.com/1200x/01/c3/d3/01c3d3ddcbe65fd835a87619983dd90f.jpg", category: "hot-dogs", subcategory: "Postres", description: "Cremoso", available: true },
    { id: 205, name: "Refresco 500ml", price: 25, image: "https://i.pinimg.com/736x/c4/ff/01/c4ff0177106b3576220d221acb6dcd19.jpg", category: "hot-dogs", subcategory: "Bebidas", description: "Cola, limón, naranja", available: true },
    // { id: 206, name: "Agua Mineral 500ml", price: 20, image: "https://i.pinimg.com/1200x/30/3f/41/303f418d7e0bc886bccd13f7c665aadb.jpg", category: "hot-dogs", subcategory: "Bebidas", description: "Ligera y refrescante" },
    { id: 207, name: "Agua Fresca Natural", price: 30, image: "https://i.pinimg.com/1200x/6a/ea/39/6aea396a484a88df702e7721c032f019.jpg", category: "hot-dogs", subcategory: "Bebidas", description: "Horchata, Jamaica, Tamarindo", available: true },
    // { id: 208, name: "Cocteleria", price: 40, image: "https://i.pinimg.com/1200x/df/5f/52/df5f5252619abfc20bc4230dae3dd142.jpg", category: "hot-dogs", subcategory: "Bebidas", description: "Frappes, Smothies, Soda Italiana" },
  
    // 🥯 Semitas
    { id: 115, name: "Pierna Clásica", price: 75, image: "https://i.pinimg.com/736x/3b/ba/c3/3bbac3af3a5ec1cb33a90b20b12233a4.jpg", category: "semitas", subcategory: "Clásicos", description: "Como la de casa", available: true },
    { id: 116, name: "Jamón y Quesillo", price: 80, image: "https://i.pinimg.com/736x/3b/ba/c3/3bbac3af3a5ec1cb33a90b20b12233a4.jpg", category: "semitas", subcategory: "Clásicos", description: "Suave y familiar", available: true },
    { id: 117, name: "Doble Sabor", price: 95, image: "https://i.pinimg.com/736x/7d/6c/d3/7d6cd3e09d3a371ffd1a65b03ab7aeda.jpg", category: "semitas", subcategory: "Especialidades", description: "Pierna + chipotle, doble emoción", available: true },
    { id: 118, name: "La Fresca", price: 90, image: "https://i.pinimg.com/1200x/a3/96/b2/a396b2d211dfc0d1853130d71cb760f2.jpg", category: "semitas", subcategory: "Especialidades", description: "Guacamole y cebolla morada", available: true },
    { id: 119, name: "La Dorada", price: 100, image: "https://i.pinimg.com/736x/72/85/06/728506102d981a1f6d6ec66996f88540.jpg", category: "semitas", subcategory: "Especialidades", description: "Con aderezo de ajo, dorada y especial", available: true },
    { id: 120, name: "Papas a la francesa con aderezo chipotle", price: 45, image: "https://i.pinimg.com/736x/b6/46/e1/b646e1c597c77568984a34226fae54e8.jpg", category: "semitas", subcategory: "Complementos", description: "Crujientes y sabrosas", available: true },
    { id: 121, name: "Totopos con guacamole", price: 50, image: "https://i.pinimg.com/736x/3e/2c/d0/3e2cd07334fa0faca258664a42e6760c.jpg", category: "semitas", subcategory: "Complementos", description: "Para compartir", available: true },
    { id: 305, name: "Chocoflan", price: 25, image: "https://i.pinimg.com/736x/4f/7d/d7/4f7dd739919a555b6ee20f15f03787d0.jpg", category: "semitas", subcategory: "Postres", description: "Artesanal", available: true },
    { id: 306, name: "Pay de Limon", price: 20, image: "https://i.pinimg.com/1200x/01/c3/d3/01c3d3ddcbe65fd835a87619983dd90f.jpg", category: "semitas", subcategory: "Postres", description: "Cremoso", available: true },
    { id: 209, name: "Refresco 500ml", price: 25, image: "https://i.pinimg.com/736x/c4/ff/01/c4ff0177106b3576220d221acb6dcd19.jpg", category: "semitas", subcategory: "Bebidas", description: "Cola, limón, naranja", available: true },
    // { id: 210, name: "Agua Mineral 500ml", price: 20, image: "https://i.pinimg.com/1200x/30/3f/41/303f418d7e0bc886bccd13f7c665aadb.jpg", category: "semitas", subcategory: "Bebidas", description: "Ligera y refrescante" },
    { id: 211, name: "Agua Fresca Natural", price: 30, image: "https://i.pinimg.com/1200x/6a/ea/39/6aea396a484a88df702e7721c032f019.jpg", category: "semitas", subcategory: "Bebidas", description: "Horchata, Jamaica, Tamarindo", available: true },
    // { id: 212, name: "Cocteleria", price: 40, image: "https://i.pinimg.com/1200x/df/5f/52/df5f5252619abfc20bc4230dae3dd142.jpg", category: "semitas", subcategory: "Bebidas", description: "Frappes, Smothies, Soda Italiana" },
  
    // 🥪 Tortas
    { id: 122, name: "Bistec Clásico", price: 85, image: "https://i.pinimg.com/736x/da/f3/f0/daf3f0b0d908dc1cd9a3be4c05285f42.jpg", category: "tortas", subcategory: "Clásicos", description: "Directo al sabor", available: true },
    { id: 123, name: "Jamón y Queso", price: 80, image: "https://i.pinimg.com/736x/6b/34/6f/6b346f8b1c24726e927cb99f7d527739.jpg", category: "tortas", subcategory: "Clásicos", description: "El combo que nunca falla", available: true },
    { id: 124, name: "Combinada KUMA", price: 120, image: "https://i.pinimg.com/1200x/71/e6/10/71e610b2e3fe8f461749a8e300c8016a.jpg", category: "tortas", subcategory: "Especialidades", description: "Bistec + jamón + queso", available: true },
    { id: 125, name: "La Dorada", price: 110, image: "https://i.pinimg.com/736x/a5/ad/f4/a5adf4a470e76b06f5d0bd94d7944359.jpg", category: "tortas", subcategory: "Especialidades", description: "Pierna con aderezo de ajo", available: true },
    { id: 126, name: "La Ranchera", price: 115, image: "https://i.pinimg.com/736x/1f/24/9f/1f249f44f4f508ec42041545f3a4dde1.jpg", category: "tortas", subcategory: "Especialidades", description: "Con chipotle y cebolla crispy", available: true },
    { id: 127, name: "Papas a la francesa con queso y chipotle", price: 50, image: "https://i.pinimg.com/736x/b6/46/e1/b646e1c597c77568984a34226fae54e8.jpg", category: "tortas", subcategory: "Complementos", description: "Crujientes y sabrosas", available: true },
    { id: 128, name: "Papas gajo con aderezo de ajo", price: 50, image: "https://i.pinimg.com/736x/97/42/a0/9742a0cf43600c92813a8311f48d6133.jpg", category: "tortas", subcategory: "Complementos", description: "Con toque de ajo", available: true },
    { id: 307, name: "Chocoflan", price: 25, image: "https://i.pinimg.com/736x/4f/7d/d7/4f7dd739919a555b6ee20f15f03787d0.jpg", category: "tortas", subcategory: "Postres", description: "Artesanal", available: true },
    { id: 308, name: "Pay de Limon", price: 20, image: "https://i.pinimg.com/1200x/01/c3/d3/01c3d3ddcbe65fd835a87619983dd90f.jpg", category: "tortas", subcategory: "Postres", description: "Cremoso", available: true },
    { id: 213, name: "Refresco 500ml", price: 25, image: "https://i.pinimg.com/736x/c4/ff/01/c4ff0177106b3576220d221acb6dcd19.jpg", category: "tortas", subcategory: "Bebidas", description: "Cola, limón, naranja", available: true },
    // { id: 214, name: "Agua Mineral 500ml", price: 20, image: "https://i.pinimg.com/1200x/30/3f/41/303f418d7e0bc886bccd13f7c665aadb.jpg", category: "tortas", subcategory: "Bebidas", description: "Ligera y refrescante" },
    { id: 215, name: "Agua Fresca Natural", price: 30, image: "https://i.pinimg.com/1200x/6a/ea/39/6aea396a484a88df702e7721c032f019.jpg", category: "tortas", subcategory: "Bebidas", description: "Horchata, Jamaica, Tamarindo", available: true },
    // { id: 216, name: "Cocteleria", price: 40, image: "https://i.pinimg.com/1200x/df/5f/52/df5f5252619abfc20bc4230dae3dd142.jpg", category: "tortass", subcategory: "Bebidas", description: "Frappes, Smothies, Soda Italiana" },
  
    // 🌮 Antojitos
    { id: 129, name: "Flautas de Papa", price: 60, image: "https://i.pinimg.com/736x/de/06/74/de0674c2fa7b1ddb615d3be2d324ff39.jpg", category: "antojitos", subcategory: "Clásicos", description: "Crujientes y cremosas", available: true },
    { id: 130, name: "Tostada de Pollo", price: 65, image: "https://i.pinimg.com/1200x/50/8d/dd/508ddd45265327644d48fafa3bba2007.jpg", category: "antojitos", subcategory: "Clásicos", description: "Ligera y fresca", available: true },
    { id: 131, name: "Flautas Mixtas", price: 80, image: "https://i.pinimg.com/736x/de/06/74/de0674c2fa7b1ddb615d3be2d324ff39.jpg", category: "antojitos", subcategory: "Especialidades", description: "Con topping de tinga, sabor doble", available: true },
    { id: 132, name: "Tostada Chipotle", price: 75, image: "https://i.pinimg.com/1200x/50/8d/dd/508ddd45265327644d48fafa3bba2007.jpg", category: "antojitos", subcategory: "Especialidades", description: "Picante y cremosa", available: true },
    { id: 133, name: "Tostada BBQ", price: 85, image: "https://i.pinimg.com/736x/48/59/64/4859643e121f4d6076142c006562a93c.jpg", category: "antojitos", subcategory: "Especialidades", description: "Con cebolla crispy, dulce y crujiente", available: true },
    { id: 134, name: "Mini flautas extra", price: 40, image: "https://i.pinimg.com/736x/de/06/74/de0674c2fa7b1ddb615d3be2d324ff39.jpg", category: "antojitos", subcategory: "Complementos", description: "3 piezas con aderezo", available: true },
    { id: 135, name: "Tostaditas extra con frijol y queso", price: 45, image: "https://i.pinimg.com/1200x/50/8d/dd/508ddd45265327644d48fafa3bba2007.jpg", category: "antojitos", subcategory: "Complementos", description: "Para compartir", available: true },
    { id: 309, name: "Chocoflan", price: 25, image: "https://i.pinimg.com/736x/4f/7d/d7/4f7dd739919a555b6ee20f15f03787d0.jpg", category: "antojitos", subcategory: "Postres", description: "Artesanal", available: true },
    { id: 310, name: "Pay de Limon", price: 20, image: "https://i.pinimg.com/1200x/01/c3/d3/01c3d3ddcbe65fd835a87619983dd90f.jpg", category: "antojitos", subcategory: "Postres", description: "Cremoso", available: true },
    { id: 217, name: "Refresco 500ml", price: 25, image: "https://i.pinimg.com/736x/c4/ff/01/c4ff0177106b3576220d221acb6dcd19.jpg", category: "antojitos", subcategory: "Bebidas", description: "Cola, limón, naranja", available: true },
    // { id: 218, name: "Agua Mineral 500ml", price: 20, image: "https://i.pinimg.com/1200x/30/3f/41/303f418d7e0bc886bccd13f7c665aadb.jpg", category: "antojitos", subcategory: "Bebidas", description: "Ligera y refrescante" },
    { id: 219, name: "Agua Fresca Natural", price: 30, image: "https://i.pinimg.com/1200x/6a/ea/39/6aea396a484a88df702e7721c032f019.jpg", category: "antojitos", subcategory: "Bebidas", description: "Horchata, Jamaica, Tamarindo", available: true },
    // { id: 220, name: "Cocteleria", price: 40, image: "https://i.pinimg.com/1200x/df/5f/52/df5f5252619abfc20bc4230dae3dd142.jpg", category: "antojitos", subcategory: "Bebidas", description: "Frappes, Smothies, Soda Italiana" },
    
  
    // 🍗 Alitas y Boneless
    { id: 136, name: "Alitas Clásicas", price: 90, image: "https://i.pinimg.com/1200x/68/32/4a/68324a5a10ede421d908e4cc95ccaf9e.jpg", category: "alitas-boneless", subcategory: "Clásicos", description: "Búfalo o BBQ, tú eliges", available: true },
    { id: 137, name: "Boneless Clásicos", price: 95, image: "https://i.pinimg.com/736x/1f/bd/c8/1fbdc885fadc004e6eada606153838c0.jpg", category: "alitas-boneless", subcategory: "Clásicos", description: "Tiernos y bañados", available: true },
    { id: 138, name: "Boneless Doble Salsa", price: 110, image: "https://i.pinimg.com/736x/c2/9a/9b/c29a9b4b4296ac34dff9c94606292ca2.jpg", category: "alitas-boneless", subcategory: "Especialidades", description: "Chipotle + BBQ, explosión de sabor", available: true },
    { id: 139, name: "Alitas Rancheras", price: 105, image: "https://i.pinimg.com/1200x/73/00/c7/7300c7765289e99e53a64c5367dace80.jpg", category: "alitas-boneless", subcategory: "Especialidades", description: "Con aderezo ranch y crispy", available: true },
    { id: 140, name: "Boneless KUMA", price: 105, image: "https://i.pinimg.com/1200x/b0/a4/a5/b0a4a5929a39cfd11668d0c17bcec4f9.jpg", category: "alitas-boneless", subcategory: "Especialidades", description: "Salsa secreta, sabor de la casa", available: true },
    { id: 141, name: "Papas gajo con doble salsa", price: 50, image: "https://i.pinimg.com/1200x/20/f1/93/20f1934582d3cdbeb075a088de615c4b.jpg", category: "alitas-boneless", subcategory: "Complementos", description: "Crujientes y doradas", available: true },
    { id: 142, name: "Mini orden de boneless (3 piezas)", price: 45, image: "https://i.pinimg.com/1200x/aa/40/a3/aa40a3b16e6bcf04fb2a3a21e7b6671a.jpg", category: "alitas-boneless", subcategory: "Complementos", description: "Para compartir", available: true },
    { id: 311, name: "Chocoflan", price: 25, image: "https://i.pinimg.com/736x/4f/7d/d7/4f7dd739919a555b6ee20f15f03787d0.jpg", category: "alitas-boneless", subcategory: "Postres", description: "Artesanal", available: true },
    { id: 312, name: "Pay de Limon", price: 20, image: "https://i.pinimg.com/1200x/01/c3/d3/01c3d3ddcbe65fd835a87619983dd90f.jpg", category: "alitas-boneless", subcategory: "Postres", description: "Cremoso", available: true },
    { id: 221, name: "Refresco 500ml", price: 25, image: "https://i.pinimg.com/736x/c4/ff/01/c4ff0177106b3576220d221acb6dcd19.jpg", category: "alitas-boneless", subcategory: "Bebidas", description: "Cola, limón, naranja", available: true },
    // { id: 222, name: "Agua Mineral 500ml", price: 20, image: "https://i.pinimg.com/1200x/30/3f/41/303f418d7e0bc886bccd13f7c665aadb.jpg", category: "alitas-boneless", subcategory: "Bebidas", description: "Ligera y refrescante" },
    { id: 223, name: "Agua Fresca Natural", price: 30, image: "https://i.pinimg.com/1200x/6a/ea/39/6aea396a484a88df702e7721c032f019.jpg", category: "alitas-boneless", subcategory: "Bebidas", description: "Horchata, Jamaica, Tamarindo", available: true },
    // { id: 224, name: "Cocteleria", price: 40, image: "https://i.pinimg.com/1200x/df/5f/52/df5f5252619abfc20bc4230dae3dd142.jpg", category: "alitas-boneless", subcategory: "Bebidas", description: "Frappes, Smothies, Soda Italiana" },
    
  ];

Product.insertMany(products)
  .then(() => console.log("Products inserted"))
  .catch(err => console.log(err));
