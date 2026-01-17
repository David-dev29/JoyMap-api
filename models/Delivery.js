import { Schema, model } from "mongoose";

let collection = "deliveries";

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // relación con el usuario
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  isAvailable: { type: Boolean, default: true }, // disponible para tomar pedidos
  activeOrder: { type: Schema.Types.ObjectId, ref: 'Order' }, // pedido actual en curso
  rating: { type: Number, default: 5 }, // calificación del repartidor
}, {
  timestamps: true
});

let Delivery = model(collection, schema);
export default Delivery;
